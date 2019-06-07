import { $body } from './commonSelectors';
import { render } from './render';

let tv = null;

export const toast = {
  init() {
    $body.on('click', '.js-toast__dismiss', function () {
      $(this).parents('.js-toast').addClass('d-none');
      clearTimeout(tv);
    });
  },
  render(errorMsg, closeBtnLabel, toastDuration) {
    if (
      typeof errorMsg === 'string'
      && errorMsg.length
    ) {
      const toast = render.get('cuhuToastMessage');
      const existingToast = $body.find('.js-toast');
      if (existingToast.length) {
        existingToast.remove();
      }
      $body.append(
        toast({
          errorMsg,
          closeBtnLabel
        })
      );
      const $toast = $body.find('.js-toast');
      $toast.removeClass('d-none');
      if (
        typeof toastDuration === 'number'
        && toastDuration > 0
      ) {
        tv = setTimeout(() => {
          $toast.addClass('d-none');
          clearTimeout(tv);
        }, toastDuration);
      }
    }
  }
};
