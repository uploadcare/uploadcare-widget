(function($) {

	function nearestFinder (targets) {
		this.targets = targets;
		this.last = null;
	}
	nearestFinder.prototype = {
		update: function() {
			var rows = {};
	
			this.targets.each(function(i) {
				var offset = $(this).offset();
				if ( ! (offset.top in rows)) {
					rows[offset.top] = [];
				}
				rows[offset.top].push([offset.left + this.offsetWidth/2, this]);
			});

			this.rows = rows;
		},

		find: function(x, y) {
			var minDistance = Infinity;
			var rows = this.rows;
			var nearestRow, top, nearest;

			for (top in rows) {
				var distance = Math.abs(top - y);
				if (distance < minDistance) {
					minDistance = distance;
					nearestRow = rows[top];
				}
			}

			minDistance = Math.abs(nearestRow[0][0] - x);
			nearest = nearestRow[0][1];
			for (var i = 1; i < nearestRow.length; i++) {
				var distance = Math.abs(nearestRow[i][0] - x);
				if (distance < minDistance) {
					minDistance = distance;
					nearest = nearestRow[i][1];
				}
			}

			return $(nearest);
		},

		findNotLast: function(x, y) {
			var nearest = this.find(x, y);

			if (this.last && nearest && this.last[0] == nearest[0]) {
				return null;
			}

			return this.last = nearest;
		}
	};


	$.fn.extend({
		moveable: function(o) {
			o = $.extend({
				distance: 4,
				anyButton: false,
				axis: false,
				zIndex: 1000,
				start: $.noop,
				move: $.noop,
				finish: $.noop
			}, o);

			function fixTouch(e) {
				if (e.originalEvent.touches) {
					e.pageX = e.originalEvent.touches[0].pageX;
					e.pageY = e.originalEvent.touches[0].pageY;
					e.which = 1;
				}
			}

			this.off('mousedown.moveable touchstart.movable');
			this.on('mousedown.moveable touchstart.movable', function(eDown) {
				fixTouch(eDown);

				if ( ! o.anyButton && eDown.which != 1) {
					return;
				}
				eDown.preventDefault();

				var dragged = false;
				var $dragged = $(eDown.currentTarget);
				var $fake = false;
				var originalPos = $dragged.position();  // offset parent

				originalPos.top += $dragged.offsetParent().scrollTop();
				originalPos.left += $dragged.offsetParent().scrollLeft();

				$(document).on('mousemove.moveable touchmove.movable', function(eMove) {
					fixTouch(eMove);

					if ( ! dragged && (Math.abs(eMove.pageX - eDown.pageX) > o.distance || Math.abs(eMove.pageY - eDown.pageY) > o.distance)) {
						dragged = true;
						$fake = $dragged.clone()
							.css({position: 'absolute', zIndex: o.zIndex,
							      width: $dragged.width()})
							.appendTo($dragged.offsetParent());
						o.start({
							event: eMove,
							dragged: $dragged,
							fake: $fake
						});
					}

					if ( ! dragged) {
						return;
					}
					eMove.preventDefault();

					var dx = o.axis == 'y' ? 0 : eMove.pageX - eDown.pageX;
					var dy = o.axis == 'x' ? 0 : eMove.pageY - eDown.pageY;
					$fake.css({left: dx + originalPos.left, top: dy + originalPos.top});
					o.move({
						event: eMove,
						dragged: $dragged,
						fake: $fake,
						dx: dx,
						dy: dy
					});
				});

				$(document).on('mouseup.moveable touchend.movable', function(eUp) {
					fixTouch(eUp);

					$(document).off('mousemove.moveable touchmove.movable');
					$(document).off('mouseup.moveable touchend.movable');

					if ( ! dragged) {
						return;
					}
					eUp.preventDefault();

					var dx = eUp.pageX - eDown.pageX;
					var dy = eUp.pageY - eDown.pageY;
					var keepFake = false;
					dragged = false;
					o.finish({
						event: eUp,
						dragged: $dragged,
						fake: $fake,
						dx: dx,
						dy: dy,
						keepFake: function() {
							keepFake = true;
						}
					});
					if ( ! keepFake) {
						$fake.remove();
					}
				});
				return false;
			});
		},

		sortable: function(o) {
			var oMovable = $.extend({}, o);
			var o = $.extend({
				check_bounds:
					function (info) {
						return true;
					},
				start: $.noop,
				attach: $.noop,
				move: $.noop,
				finish: $.noop
			}, o);
			var finder = new nearestFinder(this);
			var initialNext = false;

			oMovable.start = function(info) {
				o.start(info);
				finder.update();
				initialNext = info.dragged.next();
			};

			oMovable.move = function(info) {
				info.nearest = null;

				if (o.check_bounds(info)) {
					var offset = info.fake.offset();
					var $nearest = info.nearest = finder.findNotLast(
						offset.left + info.dragged.width() / 2, offset.top);

					if ($nearest && $nearest[0] != info.dragged[0]) {
						if (info.dragged.nextAll().filter($nearest[0]).length > 0) {
							info.dragged.insertAfter($nearest);
						} else {
							info.dragged.insertBefore($nearest);
						}
						o.attach(info);
						finder.update();
					}
				} else if (finder.last !== null) {
					finder.last = null;
					if (initialNext.length) {
						info.dragged.insertBefore(initialNext);
					} else {
						info.dragged.parent().append(info.dragged);
					}
					o.attach(info);
					finder.update();
				}

				o.move(info);
			};

			oMovable.finish = function(info) {
				var offset = info.fake.offset();
				info.nearest = null;
				if (o.check_bounds(info)) {
					info.nearest = finder.find(
						offset.left + info.dragged.width() / 2, offset.top);
				}
				o.finish(info);
			};

			return this.moveable(oMovable);
		}
	});
})(jQuery);
