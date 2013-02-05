define(['jquery','underscore','events','mustache','backbone','templates'],function ($,_,events,mustache,Backbone,templates) {
    "use strict";

    // handle keyboard shortcuts also

    var keyboardShortcuts = {};
    var widgets = {};
    var buttons = {};

    function itemSort(a,b) {
        if ( ( a.index === undefined ) && (b.index === undefined) ) return 0;

        if ( ( a.index !== undefined ) && (b.index === undefined) ) return -1;

        if ( ( a.index === undefined ) && (b.index !== undefined) ) return 1;

        return b.index - a.index;
    }

    function registerKeyboardShortcut(which,callback) {
        if (which in keyboardShortcuts) {
            throw "Trying to reregister shortcut for " + which;
        }
        keyboardShortcuts [which] = callback;
    }

    function registerWidget(data) {
        // widget is a backbone view that renders widget
        // modes is an array of modes in which this widget is active
        // toolbar takes care that widget.el exists when widget.render
        // is called

        var id = data.id;
        if (id in widgets) {
            throw "Trying to reregister widget " + id;
        }
        widgets [id] = data;
    }

    function registerButton(data) {
        // toggle makes button togleable, otherwise clickable
        // toolbar takes care of firing button-{{id}}-click,
        // events on clicks.

        var id = data.id;
        if (id in buttons) {
            throw "Trying to reregister button " + id;
        }
        buttons [id] = data;
        if (data.toggle && data.toggleCB) {
            data.toggleCB.apply(undefined,[data.active]);
        }
    }

    $('body').on('keydown',function(ev) {
        var callback = keyboardShortcuts[ev.which];
        if (callback) {
            callback();
        }
    });

    var View = Backbone.View.extend({
        initialize: function() {
            var that = this;
            this.mode = 'empty';
            events.on('changePage',function() {
                that.setMode('page');
            });
        },
        el : '#toolbar',
        events: {
            'click button': 'handleClick'
        },
        setMode: function(mode) {
            if (this.mode == mode) { return; }
            this.mode = mode;
            this.render();
        },
        handleClick: function (ev) {
            var id = ev.currentTarget.id;
            var b = buttons[id];
            if (b === undefined) return;
            var cb = b.click;
            if (cb) {
                cb.apply(ev.currentTarget,[ev]);
            }
            cb = b.toggleCB;
            if (cb) {
                var toggled = !($(ev.currentTarget).hasClass("active"));
                cb.apply(ev.currentTarget,[toggled]);
            }

            events.trigger('refocus');

            var myEvent = 'button-'+id+'-clicked';
            events.trigger(myEvent);
        },
        render: function() {
            
            var context = {
                widgets: _.map(widgets,function(w) { return w; }),
                buttons: _.map(buttons,function(b) {
                    return {
                        id: b.id,
                        classes: 'btn'+ (b.active ? ' active' : ''),
                        extra: b.toggle && 'data-toggle="button"' || '',
                        icon: b.icon,
                        title: b.title,
                        text: b.text,
                        modes: b.modes
                    };
                })
            };
            context.widgets.sort(itemSort);
            context.buttons.sort(itemSort);
            var tpl = templates.get('toolbar');
            this.$el.html(mustache.render(tpl,context));

            for (var i in widgets) {
                //if (widgets[i].modes)
                var view = widgets[i].view;
                view.setElement('#' + i);
                view.render();
            }

            //this.$el.button(); // enable bootstrap button code
        }
    });

    var view = new View();
    return {
        view : view,
        registerKeyboardShortcut : registerKeyboardShortcut,
        registerWidget : registerWidget,
        registerButton : registerButton
    };

});
