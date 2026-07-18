'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const routeScripts = (pathname) => {
  if (pathname === '/interest' || pathname === '/engage') return ['interest'];
  if (pathname === '/docs/metrics') return ['metrics'];
  if (pathname === '/platform/demo-city') return ['demo-city'];
  return [];
};

const normalizedPathname = (pathname) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
};

export function RouteScripts() {
  const pathname = usePathname() || '/';
  const names = routeScripts(normalizedPathname(pathname));

  useEffect(() => {
    let active = true;
    const initialized = new Map();
    const scripts = [];
    const tokens = window.__LOCALLOOP_FEATURE_TOKENS = window.__LOCALLOOP_FEATURE_TOKENS || {};
    const sequence = (window.__LOCALLOOP_FEATURE_SEQUENCE || 0) + 1;
    window.__LOCALLOOP_FEATURE_SEQUENCE = sequence;

    const clearFeature = (name, token) => {
      const features = window.LOCALLOOP_FEATURES;
      const feature = features?.[name];
      if (feature && (!token || feature.__localLoopToken === token)) {
        feature.cleanup?.();
        delete features[name];
      }
    };

    const load = (name) => new Promise((resolve, reject) => {
      const token = `${name}-${sequence}`;
      tokens[name] = token;
      clearFeature(name);
      document.getElementById(`local-loop-feature-${name}`)?.remove();

      const script = document.createElement('script');
      script.id = `local-loop-feature-${name}`;
      script.dataset.localLoopFeatureToken = token;
      script.src = `/assets/js/${name}.js`;
      script.async = true;
      scripts.push({ name, token, script });

      script.addEventListener('load', () => {
        const feature = window.LOCALLOOP_FEATURES?.[name];
        if (!active || feature?.__localLoopToken !== token) {
          clearFeature(name, token);
          script.remove();
          resolve(null);
          return;
        }
        resolve(feature);
      }, { once: true });
      script.addEventListener('error', () => {
        script.remove();
        reject(new Error(`Could not load ${name}`));
      }, { once: true });
      document.body.appendChild(script);
    });

    for (const name of names) {
      load(name)
        .then((feature) => {
          if (active && feature?.init && !initialized.has(name)) {
            initialized.set(name, feature);
            feature.init();
          }
        })
        .catch(() => {
          // A route remains usable when an optional enhancement cannot load.
        });
    }

    return () => {
      active = false;
      initialized.forEach((feature) => feature.cleanup?.());
      scripts.forEach(({ name, token, script }) => {
        if (tokens[name] === token) delete tokens[name];
        clearFeature(name, token);
        script.remove();
      });
    };
  }, [pathname]);

  return null;
}
