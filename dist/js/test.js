

const initPageSlider = () => {

    const $slider = $(".js-page-slider");

    $slider.slick({
      arrows: false,
      vertical: true
    });

   $slider.mousewheel((e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
         $slider.slick('slickNext');
      } else {
         $slider.slick('slickPrev');
      }
   });

   $slider.swipe(
      {
         swipe: (e, direction, distance, duration, fingerCount, fingerData) => {
            if (direction == 'up') {
               $slider.slick('slickNext');
            } else {
               $slider.slick('slickPrev');
            }
         }, 
         treshold: 50
      });
}



$( ()  => {
   initPageSlider();
})