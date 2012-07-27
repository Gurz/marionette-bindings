// Item View
// ---------

// A single item view implementation that contains code for rendering
// with underscore.js templates, serializing the view's model or collection,
// and calling several methods on extended views, such as `onRender`.
Marionette.ItemView =  Marionette.View.extend({
  _boundElements : [],

  constructor: function(){
    Marionette.View.prototype.constructor.apply(this, arguments);
    this.initialEvents();
  },

  // Configured the initial events that the item view 
  // binds to. Override this method to prevent the initial
  // events, or to add your own initial events.
  initialEvents: function(){
    if (this.collection){
      this.bindTo(this.collection, "reset", this.render, this);
    }
  },

  // Render the view, defaulting to underscore.js templates.
  // You can override this in your view definition to provide
  // a very specific rendering for your view. In general, though,
  // you should override the `Marionette.Renderer` object to
  // change how Marionette renders views.
  render: function(){
    if (this.beforeRender){ this.beforeRender(); }
    this.trigger("before:render", this);
    this.trigger("item:before:render", this);

    var data = this.serializeData();
    var template = this.getTemplate();
    var html = Marionette.Renderer.render(template, data);
    this.preTemplateRender();
    this.$el.html(html);
    this.postTemplateRender();
    this.bindUIElements();

    if (this.onRender){ this.onRender(); }
    this.trigger("render", this);
    this.trigger("item:rendered", this);
    return this;
  },

  // Override the default close event to add a few
  // more events that are triggered.
  close: function(){
    this.trigger('item:before:close');
    Marionette.View.prototype.close.apply(this, arguments);
    this.trigger('item:closed');
  },

  // Bind simple model properties to html elements in the template
  postTemplateRender : function() {
    var that = this,
        model = this.model;

    this.$el.find('[data-bind]').each(function(i, el) {
      el = $(el);
      var boundProperty = el.data('bind');

      function updateElement() { el.html(model.get(boundProperty)); }

      if (model.has(boundProperty)) {
        updateElement();
        that._boundElements.push(that.bindTo(model, 'change:' + boundProperty, updateElement, that));
      }
    });
  },

  preTemplateRender : function() {
    var that = this;

    _(this._boundElements).each(function(val){
      that.unbindFrom(val);
    });
  }
});
