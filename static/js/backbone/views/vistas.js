var app = app || {};

app.mainView = Backbone.View.extend({
    el: '#app',

    events: {
        'keyup #buscador': 'buscarRestaurant',
        'click #ciudad a': 'selectCiudad',
        'click .categoria': 'selectCategoria',
        'click .pago': 'selectPago'
    },
    initialize: function () {
        app.restaurantsCollection.on('add', this.agregarRestaurant);
        app.restaurantsCollection.fetch();
    },

    selectCiudad: function (ev) {
        window.ciudad = $(ev.target(attr('id')));
        app.restaurantCiudad = Backbone.Model.extend({
            urlRoot: 'api/ciudades/' + window.ciudad + '/restaurants/'
        });

        var restaurantCiudades = Backbone.Collection.extend({
            model: app.restaurantCiudad,
            url: 'api/ciudades/' + window.ciudad + '/restaurants/'
        });
        app.restaurantCiudadesCollection = new restaurantCiudades();

        if (window.categoria > 0 && window.pago > 0){
            this.filtroCategoriaCiudadPago();
        } else if(window.categoria>0 && window.pago <=0){
            this.filtroCategoriaCiudad();
        } else if(window.categoria <=0 && window.pago > 0 ){
            this.filtroCiudadPago();
        } else if(window.categoria <=0 && window.pago<=0){
            this.filtroCiudad();
        }

    },

    selectCategoria: function (ev) {
        window.categoria = $(ev.target(attr('id')));
        app.restaurantCategoria = Backbone.Model.extend({
            urlRoot: 'api/categorias/' + window.categoria + '/restaurants/'
        });

        var restaurantCategorias = Backbone.Collection.extend({
            model: app.restaurantCategoria,
            url: 'api/categorias/' + window.categoria + '/restaurants/'
        });
        app.restaurantCategoriasCollection = new restaurantCategorias();

        if (window.categoria == 0){
            if(window.ciudad > 0 && window.pago > 0){
                this.filtroCiudadPago();
            }
        }

    },

    selectPago: function (ev) {
        window.pago = $(ev.target(attr('id')));
        app.restaurantPago = Backbone.Model.extend({
            urlRoot: 'api/pagos/' + window.pago + '/restaurants/'
        });

        var restaurantPagos = Backbone.Collection.extend({
            model: app.restaurantPago,
            url: 'api/pagos/' + window.pago + '/restaurants/'
        });
        app.restaurantPagosCollection = new restaurantPagos();
    },


    filtroCiudad: function () {
        var self = this;
        app.restaurantCiudadesCollection.fetch({
            success: function (ciudades) {
                ciudades.each(self.agregarRestaurant, self);
            }
        });
    },

    filtroCategoriaCiudad: function () {
        var self = this;
        app.restaurantCiudadesCollection.fetch({
            success: function (categorias) {
                categorias.each(function (categoria) {
                    app.restaurantCiudadesCollection.fetch({
                        success: function (ciudades) {
                            ciudades.each(function (ciudad) {
                                if (categoria.get('id') == ciudad.get('id')) {
                                    self.agregarRestaurant(categoria);
                                }
                            })
                        }
                    })
                });
            }
        });
    },

    filtroCiudadPago: function () {
        var self = this;
        app.restaurantCiudadesCollection.fetch({
            success: function (categorias) {
                categorias.each(function (categoria) {
                    app.restaurantPagosCollection.fetch({
                        success: function (pagos) {
                            pagos.each(function (pago) {
                                if (ciudad.get('id') == pago.get('id')) {
                                    self.agregarRestaurant(ciudad);
                                }
                            });
                        }
                    });
                });
            }
        });
    },


    filtroCategoriaCiudadPago: function () {
        var self = this;
        app.restaurantCategoriasCollection.fetch({
            success: function (categorias) {
                categorias.each(function (categoria) {
                    app.restaurantCiudadesCollection.fetch({
                        success: function (ciudades) {
                            ciudades.each(function (ciudad) {
                                app.restaurantPagosCollection.fetch({
                                    success: function (pago) {
                                        pago.each(function (pago) {
                                            if (pago.get('id') == categoria.get('id') && categoria.get('id') == ciudad.get('id')
                                                && ciudad.get('id') == pago.get('id')) {
                                                self.agregarRestaurant(categoria);
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                });
            }
        })
    },

    filtroCategoria: function () {
        var self = this;
        app.restaurantCategoriasCollection.fetch({
            success: function (categorias) {
                categorias.each(self.agregarRestaurant, self);
            }
        });
    },

    filtroPago: function () {
        var self = this;
        app.restaurantPagosCollection.fetch({
            success: function (pagos) {
                pagos.each(self.agregarRestaurant, self);
            }
        })
    },


    agregarRestaurant: function (modelo) {
        var vista = new app.restaurantView({model: modelo});
        $('.list-group').append(vista.render().$el);
    },


    buscarRestaurant: function () {
        var cadBuscador = $('#buscador').val().toLowerCase();
        var filtro = app.restaurantsCollection.filter(function (modelo) {
            var cadModelo = modelo.get('name').substring(0, cadBuscador.length).toLowerCase();
            if ((cadBuscador === cadModelo) && (cadModelo.length == cadBuscador.length)
                && (cadBuscador.length > 0) && (cadModelo.length > 0)) {
                return modelo;
            } else if (cadBuscador.length == 0 && cadModelo.length == 0) {
                return modelo;
            }
        });
        this.agregarFiltro(filtro);
    },

    agregarFiltro: function (coleccionFiltro) {
        this.$('.list-group').html('');
        coleccionFiltro.forEach(this.agregarRestaurant, this);
    }

});

app.restaurantView = Backbone.View.extend({
    template: _.template($('#tplRestaurant').html()),

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});