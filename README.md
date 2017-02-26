XQCore
------

XQCore is a MVP (Model, View, Presenter) Javascript framework to build webapps.
The model view presenter pattern is a derivation of the model view controller pattern, it seperates the model from the view and connects this two components with a presenter. This makes your code better testable.

XQCore comes with a set of components.


## Model
A model represents your data and contains all logic to handle them.
The data integrity can be controlled and validated by a model schema.

```js
var model = new XQCore.Model('mymodel', {
  schema: {
    title: { type: 'string', min: 3, max: 100, required: true },
    description: { type: 'string', min: 5, max: 1000, required: true }
  }
});

model.set({
  title: 'Test',
  description: 'Lorem testum...'
});

var data = model.get();

/*
data === {
  title: 'Test',
  description: 'Lorem testsum...'
}
*/

```
## List

Lists are collections of models. Each list item is a model.

## View

A view is simply a template. The presenter gets data from a model und takes the view to create html.
We use FireTPL template engine to render html. FireTPL supports two syntax types. The ftl syntax is a bracelet syntax, and it supports the Handlebars syntax.

## Presenter

A presenter connects a model with a view. This is the component who holds all together.

## SyncModels

Syncroniced models are models who are connected over socket to a webserver. Everytime when the model in the backend changes, the syncroniced model will change either. This two models are in sync. One backend model can be connected to multiple client models.

## SyncLists

Same liek a SyncModel, its connected to a list on the backend site.

## Services

Services are the connection to a backend site. They fetch data from a backend API or webservices.

## Routing

Everyone needs routing. XQCore supports html5 routing API or uses hash links.

## Event Emitter



## Socket

## Logging
