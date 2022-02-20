# Official Website of Nirmal Khedkar
Official Website

```
/.github
    /workflows
    build-and-test.yml
/app
    /api
        /[Name]API
            [Name]API.js
            [Name]API.test.js
    RestClient.ts
 /components
  /elements
   /[Name]
    [Name].tsx
    [Name].module.scss
    [Name].test.ts
  /modules
  /templates
  /layouts
 /constants
 /context
  /[Name]Context
   [Name]Provider.tsx
   [Name]Reducer.ts
   [Name]Actions.ts
 /hooks
 /styles
  /abstracts
   _functions.scss
   _mixins.scss
   _variables.scss
  /base
   _base.scss
   _typography.scss
  app.scss
 /types
 /utils
/test
 /fixtures
 /spec
  /integration
  /e2e
 /support
/pages
 404.tsx
 _app.tsx
 _document.tsx
 _error.tsx
 indext.tsx
/public
 /images
 robots.txt
 favicon.ico
```

## GitHub Workflows
In this folder, you will find all the workflows for GitHub actions. By default, I added one workflow.
### build-and-test.yml
This workflow will run on every pull request creation, to make sure every test turns green and the app build runs successfully. You could also run it on every push but I recommend you only do this on your main/master and develop branch, to save GitHub Actions minutes. The GitHub Actions feature is billed by minutes/month. You can get more information in the official docs from GitHub.

## app
The app directory is where our application actually lives. I like the approach of having the application files, which are not dedicated to the framework bundled in a specific directory.
### api
This folder contains all code we need to access the APIs of our application. Personally, I like to have one folder for each REST API controller. Each folder then contains the functions for the API calls as well as the tests.

### components 
The components directory contains all your elements, modules, templates, and layouts. I will explain each of these under a separate title. Some of you may prefer the Atomic Design by Brad Frost which is fine as well. In my opinion, the Atomic Design Pattern is sometimes a little bit confusing whether a component is a molecule or organism.

#### elements
This directory contains all the basic building blocks for your app. For example a button or a headline component.
#### modules
Create all your components here which are more than a basic building block. This could be a header or a footer component. Most likely those modules are built out of multiple elements.
#### templates
In the templates directory, you should place all your page templates which are then called from your Next.js specific pages. You can find an example of this pattern in the Repository.
#### layouts
Layouts are used to wrap your Templates and provide them with the components which will be displayed by default in a specific layout. For example, you would include the Footer and the Header in a default layout.