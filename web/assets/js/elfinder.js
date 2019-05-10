(function ($) {
    var blankImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
    var setValue = null
    var settings = {}

    var setValueCallback = function(value, id) {
        setImage(value, id)
        window.setValue = setValue
    }

    var setImage = function(value, id) {
        var match = /([^#]+)(?:#([0-9]+)(?::(.+))?)?/.exec(id)
        if (null === match) {
            return
        }

        id = match[1]
        index = ('undefined' === typeof match[2]) ? -1 : parseInt(match[2])
        method = ('undefined' === typeof match[3]) ? null : match[3]

        var input = $('[data-elfinder-id="'+id+'"]').closest('.elfinder').find('input')

        var files = []
        try {
            files = JSON.parse($(input).val())
        } catch (ex) {}

        if (index > -1) {
            files.splice(index, 'replace' === method ? 1 : 0, value)
        } else {
            files.push(value)
        }
        $(input).val(JSON.stringify(files))
        build()
    }

    var getId = function(el) {
        return $(el).closest('.elfinder').find('input').data('elfinder-id')
    }

    var getIndex = function (el) {
        return $(el).closest('.image').index()
    }

    var getElement = function(type, id) {
        try {
            var selector = '[data-type="elfinder-'+type+'"]'
            if (id) {
                selector += '[data-elfinder-id="'+id+'"]'
            }
            return $(selector)
        } catch (ex) {
            return null
        }
    }

    var getElfinderUrl = function(id) {
        return settings.urls[id]
    }

    var selectImage = function(replace) {
        replace = true === replace
        var id = getId(this)
        var url = getElfinderUrl(id)

        if (null !== url) {
            var id = getId(this)
            var index = getIndex(this)
            if (index >= 0) {
                id += '#' + (index + (replace ? 0 : 1))
                if (replace) {
                    id += ':replace'
                }
            }
            url += (url.indexOf('?') < 0 ? '?' : '&') + 'id=' + encodeURIComponent(id)
            setValue = window.setValue
            window.setValue = setValueCallback
            window.open(url, 'elfinderWindow', 'height=450, width=900')
        }
    }

    var translate = function(text) {
        return ('undefined' !== typeof settings.messages)
            && ('undefined' !== typeof settings.messages[text])
            ? settings.messages[text]
            : text
    }

    var removeImage = function() {
        if (confirm(translate('Confirm remove image'))) {
            var image = $(this).closest('.image')
            var input = $(image).closest('.elfinder').find('input')
            var files = []
            try {
                files = JSON.parse($(input).val())
            } catch (ex) {}

            var index = $(image).index()
            files.splice(index, 1)
            $(input).val(JSON.stringify(files))
            build()
        }
    }

    var replaceImage = function() {
        if (confirm(translate('Confirm replace image'))) {
            selectImage.call(this, true)
        }
    }

    var moveLeft = function() {
        var index = getIndex(this)
        var input = $(this).closest('.elfinder').find('input')
        var files = []
        try {
            files = JSON.parse($(input).val())
        } catch (ex) {}
        if (index > 0) {
            var tmp = files[index - 1]
            files[index - 1] = files[index]
            files[index] = tmp
            $(input).val(JSON.stringify(files))
            build()
        }
    }

    var moveRight = function() {
        var index = getIndex(this)
        var input = $(this).closest('.elfinder').find('input')
        var files = []
        try {
            files = JSON.parse($(input).val())
        } catch (ex) {}
        if (index < files.length) {
            var tmp = files[index + 1]
            files[index + 1] = files[index]
            files[index] = tmp
            $(input).val(JSON.stringify(files))
            build()
        }
    }

    var build = function() {
        $('.elfinder').each(function() {
            var ui = $(this).find('.elfinder-ui')
            if (0 === ui.length) {
                ui = $('<div class="elfinder-ui"></div>').appendTo(this)
            }

            $(ui).empty()

            var files = []
            try {
                files = JSON.parse($(this).find('input').val())
            } catch (ex) {}
            $(files).each(function (index, file) {
                var image = $('<div/>', {'class': 'image'}).appendTo(ui)
                $('<img/>', {'src': file, 'class': 'img-responsive'}).appendTo(image)
                var controls = $('<div/>', {'class': 'controls'}).appendTo(image)
                if (index > 0) {
                    $('<button type="button"></button>').appendTo(controls).on('click', moveLeft).html(translate('Move image left'))
                }
                if (index < files.length - 1) {
                    $('<button type="button"></button>').appendTo(controls).on('click', moveRight).html(translate('Move image right'))
                    // $('<button type="button"></button>').appendTo(controls).on('click', selectImage).html(translate('Add image after'))
                }
                $('<button type="button"></button>').appendTo(controls).on('click', removeImage).html(translate('Remove image'))
                $('<button type="button"></button>').appendTo(controls).on('click', replaceImage).html(translate('Replace image'))
            })

            var addImage = $('<div/>', {'class': 'add-image'}).appendTo(ui)
            $('<button type="button" class="btn"></button>').appendTo(addImage).on('click', selectImage).html(translate('Add image'))

        })
    }

    if ('undefined' !== typeof window.elfinderSettings) {
        settings = window.elfinderSettings

        $('.field-collection [data-prototype]').on('easyadmin.collection.item-added easyadmin.collection.item-deleted', function(event) {
            build()
        })

        build()
    }
}(jQuery))
