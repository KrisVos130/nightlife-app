'use strict';

$(function(){

    var $search = $("#search");
    var $submitSearch = $("#submit-search");

    if (localStorage.getItem("location") === null) {
        localStorage.setItem("location", "");
    }
    $search.val(localStorage.getItem("location"));
    submitSearch();
    
    $submitSearch.on('click', submitSearch);
    $search.on("keydown", function(event) {
      if(event.keyCode === 13 ) {
        submitSearch();
      }
    });
    
    function submitSearch() {
        var location = $search.val();
        if (location.length <= 0) {
            location = "Amsterdam";
            $search.val("Amsterdam");
        }
        localStorage.setItem("location", location);
        $.ajax({
            type: "GET",
            url: '/api/yelp?location=' + location,
            contentType: "application/json",
            dataType: "json",
            success: function(data){
               populateList(data);
            }
        });
        $("#bars").empty();
    }
    
    var bars = [];
    
    function populateList(data) {
        $("#bars").empty();
        bars = [];
        for(var i in data.businesses){
            bars.push(data.businesses[i].id);
            (function(i){
                $.ajax({
                type: "GET",
                url: '/api/going/count?id=' + data.businesses[i].id,
                contentType: "application/json",
                dataType: "json",
                success: function(data){
                    i = Number(i);
                    var bar = $(".bar:nth-of-type(" + (i + 1) + ")");
                    var span = bar.find(".going").text(" " + data.amount + " going");
                }
            });})(i)
            data.businesses[i].image_url = data.businesses[i].image_url.replace("http:", "https:");
            $("#bars").append('<div class="bar"><img class="bar-img" src="' + data.businesses[i].image_url + '" /><a href="' + data.businesses[i].url + '" class="bar-name">' + data.businesses[i].name + '</a><small> ' + data.businesses[i].rating + ' stars</small><br><span class="going noselect" data-id="' + data.businesses[i].id + '"> 0 GOING</span><h4 class="bar-snippet">' + data.businesses[i].snippet_text + '</h4></div>');
            $("#bars").append('<span class="clear"></span>');
        }
        $(".going").on("click", function() {
            var $this = $(this);
            var id = $this.data("id");
            $.ajax({
                type: "GET",
                url: '/api/going?id=' + id,
                contentType: "application/json",
                dataType: "json"
            }).done(function(res) {
                if (res.error !== undefined && res.error === "login") {
                    window.location.href = "/login";
                }
            });
        });
    }
    
    setInterval(function() {
        refreshGoing();
    }, 1000);
    
    function refreshGoing() {
        for (var i = 0; i < bars.length; i++) {
            (function(i){
                $.ajax({
                type: "GET",
                url: '/api/going/count?id=' + bars[i],
                contentType: "application/json",
                dataType: "json",
                success: function(data){
                    i = Number(i);
                    var bar = $(".bar:nth-of-type(" + (i + 1) + ")");
                    var span = bar.find(".going").text(" " + data.amount + " going");
                }
            });})(i)
        }
    }
});