// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import { createMetadata } from '@/app/config/metadata';

export const metadata = createMetadata({
  title: 'Licences and notices',
  description:
    'Which licence applies to the localLOOP site, the LOOP specification, brand assets and third-party fonts, icons and map data.',
  path: '/docs/licenses',
});

export default function LicensesPage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Licences and notices</h1>
        <p>
          © 2025–2026 Alphin Tom / Mycel UG (haftungsbeschränkt). localLOOP is an
          early-stage lab demo; these terms describe the material published here
          and do not imply any pilot or production deployment.
        </p>
        <div className="cta-row">
          <a className="button secondary" href="/docs/">Back to docs</a>
        </div>
      </div>
      <div className="content-panel">
        <h2>Terms by material</h2>
        <div className="table-list">
          <div>
            <span>Site code and content</span>
            <div>
              MIT (<a href="/licenses/LICENSES/MIT.txt">licence text</a>)
            </div>
          </div>
          <div>
            <span>LOOP specification prose</span>
            <div>
              CC BY-SA 4.0: the specification, docs, RFCs and profile guidance{' '}
              (<a href="/licenses/LICENSES/CC-BY-SA-4.0.txt">licence text</a>)
            </div>
          </div>
          <div>
            <span>LOOP schemas, contexts, examples, OpenAPI</span>
            <div>
              MIT (<a href="/licenses/LICENSE.txt">project terms</a>)
            </div>
          </div>
          <div>
            <span>Brand assets</span>
            <div>
              The localLOOP and LOOP names, logo, favicons and concept images are
              reserved; referring to the project by name is fine{' '}
              (<a href="/licenses/LICENSES/LicenseRef-Mycel-Brand.txt">brand terms</a>)
            </div>
          </div>
          <div>
            <span>Fonts</span>
            <div>
              Fraunces, Space Grotesk and IBM Plex Mono under the SIL Open Font
              License 1.1 (<a href="/licenses/LICENSES/OFL-1.1.txt">licence text</a>)
            </div>
          </div>
          <div>
            <span>Icons</span>
            <div>Phosphor Icons 2.1.2, MIT, © 2020–2021 Phosphor Icons</div>
          </div>
          <div>
            <span>Hero map</span>
            <div>
              Map data ©{' '}
              <a href="https://www.openstreetmap.org/copyright" rel="noreferrer noopener">
                OpenStreetMap contributors
              </a>
              , available under the Open Database License{' '}
              (<a href="/licenses/LICENSES/ODbL-1.0.txt">licence text</a>)
            </div>
          </div>
        </div>
      </div>
      <div className="content-panel">
        <h2>Full terms</h2>
        <div className="table-list">
          <div>
            <span>
              <a href="/licenses/LICENSE.txt">LICENSE</a>
            </span>
            <div>Project terms and the map of which files use which licence</div>
          </div>
          <div>
            <span>
              <a href="/licenses/NOTICE.txt">NOTICE</a>
            </span>
            <div>Required attributions</div>
          </div>
          <div>
            <span>
              <a href="/licenses/THIRD_PARTY_NOTICES.md">Third-party notices</a>
            </span>
            <div>Every bundled component with its version, licence and copyright</div>
          </div>
        </div>
      </div>
    </div>
  );
}
