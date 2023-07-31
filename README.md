# PartyPaymentsApp


## Project Structure
![project structure.JPG](src%2Fassets%2FUML%2Fimages%2Fproject%20structure.JPG)

U can find a details in: [Project Structure.drawio](src%2Fassets%2FUML%2Fdiagrams%2FProject%20Structure.drawio)

## Git conventions
Three kaywords are supported: `feat`, `fix` and `hotfix`:
- `feat` - short from `feature`. A new feature as a task or part of a story.
- `fix` - bugfix
- `hotfix` - bugfix but if it's urgent

### Commit message conventions
Each commit should satisfy this mask `{KEYWORD}: {MESSAGE}. Resolve: {BRANCH_NAME}`. For example: `feat: create a new feature. Resolve: PP-12`.
Hotfix commit messages can (but not has) ignore the **Resolve** part.

### Branch naming conventions
Each branch should satisfy this mask `{KEYWORD}/{BRANCH_NAME}`. For example: `feat/PP-12`. No need to create branches for hotfix. Hotfix can be pushed to dev directly.

### Git flow
![git flow](src%2Fassets%2FUML%2Fimages%2Fgit%20flow.JPG)

Main points:
- unused branches have to be deleted
- need to squash commits before merge to dev
- CI\CD is looking on main branch, and new version will be built only if new code is pushed to main branch

### Setup project
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

