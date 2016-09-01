console.log('scripts.js sourced!');
/// == Global Variable Declarations == ///
var searchResults = [];
var numResults = 0;

/// == Function Declarations == ///

function getInputs(){
  console.log('in getInputs');
  var movieTitle = $('#movieTitleIn').val();
  // First check if movieTitle is empty
  if (movieTitle === '') {
    return false;
  } else {
    // Clean out any invalid characters in the year
    var movieYear = $('#movieYearIn').val().replace(/[^\d]/g,'');
    // Check for checkbox status
    var limitMovies = $('#limitMoviesIn').is(':checked');

    console.log('Returning:',movieTitle, movieYear, limitMovies);
    return [movieTitle, movieYear, limitMovies];
  }
} // end getInputs

function buildSearchUrl(inputs){
  console.log('in buildSearchUrl');
  searchTitle = inputs[0];
  searchYear = inputs[1];
  requestLimit = inputs[2];

  urlBuilder = 'http://www.omdbapi.com/?s='+searchTitle+'&y=';

  // Check for valid search year and ignore if not
  if ((searchYear<1888)||(searchYear>2050)){
    // if the searchYear is an empty string then the user does not need an alert
    if (searchYear !== ''){
      alert('Invalid production year! It will not be included in the search.');
    }
  } else {
    // otherwise add it to the search
    urlBuilder += searchYear;
  }

  // Check to see if it was requested for the search to be limited
  if (requestLimit){
    urlBuilder += '&type=movie';
  }

  console.log('Returning:',urlBuilder);
  return urlBuilder;
} // end buildSearchUrl

function searchNow(){
  console.log('in searchNow');

  // get user input
  var searchInputs = getInputs();

  if (!searchInputs) {
    // This will happen only if searchInputs is false from getInputs
    alert('Please enter a movie title!');
  } else {
    // Build searchUrl
    searchUrl = buildSearchUrl(searchInputs);
    console.log('Received:', searchUrl);
    // Make ajax call
    $.ajax({
      url: searchUrl,
      dataType: 'JSON',
      success: function(data){
        console.log('in Ajax success, with data:', data);

        if (data.Response === "False"){
          alert('Sorry! No movies were found with those search terms!');
          console.log(searchResults);
        } else {
          searchResults = data.Search;
          numResults = Number(data.totalResults);
          console.log('Got results!',searchResults,numResults);
          //Clear inputs
          clearInputs();
          displayResults(searchResults,numResults);
        }

      },
      statusCode: {
        404: function(){
          alert('404 Error! Cannot load page');
        }
      }
    }); // end ajax
  }
}

function clearInputs(){
  console.log('in clearInputs');

  $('#movieTitleIn').val('');
  $('movieYearIn').val('');
  $('#limitMoviesIn').prop('checked', false);
}

function displayResults(resultList,resultNum){
  console.log('in displayResults');

  var resultBuilder = '';

  for (var i = 0; i < resultList.length; i++) {
    resultBuilder += '<p><h2 id="titleText">'+resultList[i].Title+'</h2>'+
    resultList[i].Year+'</p><img src="'+resultList[i].Poster+'"/>';
  }
  $('#outputDiv').html(resultBuilder);
}

/// == JavaScript == ///

$(document).ready(function(){
  console.log('Document ready!');

  $('#searchButton').on('click', searchNow);

}); // end document ready
