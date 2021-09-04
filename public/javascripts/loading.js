document.onreadystatechange = function () {
  var state = document.readyState;

  if (state == 'loading') {
    document.getElementById('loading').style.display = 'flex';
  } else if (state == 'interactive') {
    setTimeout(function () {
      document.getElementById('loading').style.display = 'none';
    }, 1000);
  }
};

// $('#download_button').click(function () {
//   $('#loading').css('display', 'flex');
// });
