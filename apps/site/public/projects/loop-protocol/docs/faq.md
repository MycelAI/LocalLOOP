# FAQ

## What is LOOP?
LOOP is a federated protocol for tracking materials, settling exchanges, and coordinating circular economy flows between autonomous city nodes.

## Who can run a LOOP node?
Any municipality, cooperative, or authorized operator can run a node, provided they meet the security and compliance requirements in the specification.

## What is MaterialDNA?
MaterialDNA is the globally unique identifier and metadata record for a material item or batch.

## What is ProductDNA?
ProductDNA is the product-level counterpart to MaterialDNA. It captures product category, condition, lifecycle stage, and references to constituent MaterialDNA entries. ProductDNA is aligned with EU Digital Product Passport requirements (ESPR Art. 9-10, UNTP ProductPassport).

## How do MaterialDNA and ProductDNA relate?
Materials compose products. A standing desk (ProductDNA) might contain metal-steel and plastic-hdpe (MaterialDNA entries). ProductDNA links to its materials via `material_ids`. Both flow through the same Offer → Match → Transfer lifecycle.

## Do nodes have to use LoopCoin?
LoopCoin is part of the core protocol for settlement. Implementations can support additional currencies, but LoopCoin is required for interoperability.

## How are LoopSignals decided?
Each node publishes community-defined signals through a local voting process and exposes them via the required endpoints.

## How do I propose changes to the protocol?
Open a discussion, then submit an RFC using the template in `rfcs/0000-template.md`.

## Where are the schemas and examples?
Schemas are in `schemas/` and validated examples are in `examples/`.
