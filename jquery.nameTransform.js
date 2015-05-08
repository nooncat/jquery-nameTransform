(function($) {

  var text_width = function ($target, text) {
    var test_elem = '<span style="display:none white-space:nowrap">' + text + '</span>',
        child = $target.children(),
        width;

    child.append(test_elem);
    width = child.find('span:last').width();
    child.find('span:last').remove();

    return width;
  };

  var create_name_cases = function (name_array) {
    var name_cases = [];

    name_cases.push(name_array[1] + ' ' + name_array [2]);
    name_cases.push(name_array[0] + ' ' + name_array[1].charAt(0) +
                                 '. ' + name_array[2].charAt(0) + '.');
    name_cases.push(name_array[0].charAt(0) + '. ' + name_array[1].charAt(0) +
                                            '. ' + name_array[2].charAt(0) + '.');
    name_cases.sort(function(a,b) {
      return b.length - a.length;
    });

    return name_cases;
  };

  var transform = function ($target, names, max_width, pads_margs) {
    var test_width,
        i,
        result;

    for (i = 0; i < names.length; i += 1) {
      test_width = text_width($target, names[i]) + pads_margs;
      if (test_width < max_width) {
        result = names[i];
        break;
      }
    }

    return result;
  };

  $.fn.nameTransform = function (method) {
    return this.each(function () {
      var $target = $(this),
          $parent = $target.parent(),
          start_width = $target.outerWidth(),
          start_name = $target.children().html(),
          paddings_margins = start_width - $target.children().width(),
          name_cases = create_name_cases(start_name.split(' ')),
          window_width = $(window).width(),
          parent_width = $parent.width(),
          total_width = 0,
          new_width_max,
          new_text,
          changed = false,
          total = false;

      $parent.children().each(function () {
        total_width += $(this).outerWidth(true);
      });
      changeOverlowCheckParent();

      $(window).resize($.throttle(20, resizeHandler));

      function resizeHandler() {
        if (!total) {
          parent_width = $parent.width();
          window_width = $(window).width();
          changeOverlowCheckParent();
        } else {
          window_width = $(window).width();
          changeOverlowCheckWindow();
        }
      }

      function changeOverlowCheckParent() {
        if ((total_width > parent_width) &&
                  (total_width - start_width < parent_width)) {
          new_width_max = parent_width - (total_width - start_width);
          new_text = transform($target, name_cases, new_width_max, paddings_margins);
          $target.children().html(new_text);
          changed = true;
          total_width += window_width - parent_width;
          total = true;
        }
      }

      function changeOverlowCheckWindow() {
        if ((total_width > window_width) && (total_width - start_width < window_width)) {
          new_width_max = window_width - (total_width - start_width);
          new_text = transform($target, name_cases, new_width_max, paddings_margins);
          $target.children().html(new_text);
          changed = true;
        } else if (changed === true) {
          $target.children().html(start_name);
          changed = false;
        }
      }
    });
  };
}(jQuery));
