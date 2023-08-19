# PartyPaymentsApp


## Project Diagram
![project structure.JPG](src%2Fassets%2FUML%2Fimages%2Fproject%20structure.JPG)

U can find a details in: [Project Structure.drawio](src%2Fassets%2FUML%2Fdiagrams%2FProject%20Structure.drawio)

### Structure
- **app**: Application dir. All pages and components are there.
- **business**: Main app logic. No framework based.
  - **core**: Generalized classes.
  - **modules**: Modules are domain-based. Pls follow the GRASP pattern `low coupling / high cohesion` editing/creating the modules.
    - **model**: Rich model. Contains a description of entities and a methods for working with them.
    - **controller**: Related to GRASP pattern `controller`. Contains imperative code describing scenarios. Each controller contain `storageFactory` and `mappersFactory`. Also each controller is a part of angular DI.
    - **storage**: Contain collection of entities. Can be extended with some event-bus subscriptions. <ins>Don't extend it with custom methods</ins>!
    - **mapper**: Part of the dal layer. Contains the logic for mapping entities from the adapter response.
  - **dal**: The layer containing the logic for obtaining information from third-party resources. Created on the basis of the [data-mapper pattern](https://designpatternsphp.readthedocs.io/ru/latest/Structural/DataMapper/README.html).
  - **storages**: Generalized storage logic. Contains collections of entities and methods for processing them.
    - **event bus**: A data bus that allows repositories to respond to changes in other repositories and update information in their own.
- **services**: The usual angular services. They have access to repositories and allow components to retrieve data from them or subscribe to their updates.

## Git conventions
Three kaywords are supported: `feat`, `fix` and `hotfix`:
- `feat` - short from `feature`. A new feature as a task or part of a story.
- `fix` - bugfix
- `hotfix` - bugfix but if it's urgent

### Commit message conventions
Each commit should satisfy this mask `{KEYWORD}: {MESSAGE}. Resolve: {TICKET_NUMBER}`. For example: `feat: create a new feature. Resolve: PP-12`.
Hotfix commit messages can (but not has) ignore the **Resolve** part.

### Branch naming conventions
Each branch should satisfy this mask `{KEYWORD}/{TICKET_NUMBER}`. For example: `feat/PP-12`. No need to create branches for hotfix. Hotfix can be pushed to dev directly.

### Git flow
![git flow](src%2Fassets%2FUML%2Fimages%2Fgit%20flow.JPG)

## Setup project
Before starting this project you will need links to your Firebase database and API.

To do this, you need to find the `environments` folder.
<br>
There are two files:
  - `environment.ts` [link](src/environments/environment.ts) - for production
  - `environment.development.ts` [link](src/environments/environment.development.ts) - for development

You need to add a URL for `Firebase` and the `API`, for example:

```js 
  firebaseUrl: 'example.firebase',
  apiUrl: 'https://example.com/api/',
```

