// SPDX-FileCopyrightText: 2025-2026 Alphin Tom / Mycel UG (haftungsbeschränkt)
// SPDX-License-Identifier: MIT

import MarkdownDoc from '@/app/components/docs/MarkdownDoc'
import { createMetadata } from '@/app/config/metadata'

export const metadata = createMetadata({
  title: 'Contribute',
  description: 'Find localLOOP contribution guidance, collaboration standards, and draft project resources.',
  path: '/contribute',
});

export default function ContributePage() {
  return (
    <div className="content-stack">
      <div className="content-panel">
        <h1 className="hub-heading">Help shape the localLOOP platform.</h1>
        <p>
          Contributions are welcome across specs, schemas, docs, and tooling.
          This project is early-stage, so feedback is especially valuable.
        </p>
        <p>
          Everything is developed in the open in one repository,{' '}
          <a href="https://github.com/MycelAI/LocalLOOP">MycelAI/LocalLOOP</a>: the protocol,
          this site and the lab API. Open an issue or a pull request there.
        </p>
        <div className="cta-row">
          <a className="button primary" href="https://github.com/MycelAI/LocalLOOP/issues/new/choose">Open an issue</a>
          <a className="button secondary" href="https://github.com/MycelAI/LocalLOOP">View the repository</a>
          <a className="button secondary" href="/projects/">Project hub</a>
        </div>
      </div>

      <div className="content-panel">
        <h2>Community standards</h2>
        <div className="table-list">
          <div>
            <span><a href="/contribute/CODE_OF_CONDUCT.md/">Code of conduct</a></span>
            <div>Shared expectations for collaboration</div>
          </div>
          <div>
            <span><a href="/docs/licenses/">Licences</a></span>
            <div>Code MIT, specification prose CC BY-SA 4.0, brand assets reserved</div>
          </div>
        </div>
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/CONTRIBUTING.md" />
      </div>
      <div className="content-panel">
        <MarkdownDoc filePath="projects/loop-protocol/CODE_OF_CONDUCT.md" />
      </div>
    </div>
  );
}
