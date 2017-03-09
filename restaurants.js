var render = function() {
	var restobloc="";
	for (var i = 0; i < restos.length; i++) {
		restobloc = "<div class='RestoItem' data-id='"+i+"' id ='resto-"+i+"' onclick='fillinfos("+i+")' onmouseover='addcolor(this)' onmouseout='removecolor(this)' onclick='LoadInfo(this)'><div class='Image'>"
				   +"<img src='"+restos[i].icon+"' style='width:80px;height:80px;'></div>"
		+"<div class='InformationResto'><a id='NomRestoListe'>"+restos[i].name+"</a><br><label id='NumRating'>"+RatingNum(i)+"</label><label id='RatingResto'>"+ReviewStars(i)+"</label><br><a target='blank' class='adresse'>"+restos[i].formatted_address+"</a></div></div>"
		$(".ListeRestaurants").append($(restobloc));
	}
};


function getElementsByIdStartsWith(container, selectorTag, prefix) {
    var items = [];
    var myPosts = document.getElementById(container).getElementsByTagName(selectorTag);
    for (var i = 0; i < myPosts.length; i++) {
        //omitting undefined null check for brevity
        if (myPosts[i].id.lastIndexOf(prefix, 0) === 0) {
            items.push(myPosts[i]);
        }
    }
    return items;
}

function  getElements(id) {
  if (typeof id == "object") {
    return [id];
  } else {
    return document.querySelectorAll(id);
  }
}

function filterHTML(id, sel, filter) {
  var a, b, c, i, ii, iii, hit;
  a = getElements(id);
  for (i = 0; i < a.length; i++) {
    b = getElements(sel);
    for (ii = 0; ii < b.length; ii++) {
      hit = 0;
      if (b[ii].innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
        hit = 1;
      }
      c = b[ii].getElementsByTagName("*");
      for (iii = 0; iii < c.length; iii++) {
        if (c[iii].innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
          hit = 1;
        }
      }
      if (hit == 1) {
        b[ii].style.display = "";
      } else {
        b[ii].style.display = "none";
      }
    }
  }
}


function addcolor(x) {
	x.style.backgroundColor = "grey";
}

function removecolor(x) {
	x.style.backgroundColor = " #dedddd";
}

function LoadInfo(x) {
	x.style.backgroundColor = "red";
}

function RatingNum(x) {
	if (restos[x].rating <= 5){
		return restos[x].rating;
	}
	else {
		return "";
	}
}

function CheckStars(value) {
	if (value >= 1){
		if (value < 1.5){
			return "★☆☆☆☆"
		}
		else if (value < 2.5){
			return "★★☆☆☆"
		}	
		else if (value < 3.5){
			return "★★★☆☆"
		}	
		else if (value < 4.5){
			return "★★★★☆"
		}	
		else { //if (value <= 5)
			return "★★★★★"
		}	
	}else {
		return "☆☆☆☆☆";
	}
}


function ReviewStars(x) {
	return CheckStars(restos[x].rating);

}

function fillinfos(index){
	//var index = data.getAttribute("data-id"); 	
	$("#nomresto").text(restos[index].name);
	$("#imgresto").attr("src",restos[index].icon);
	$("#sitewebresto").attr("href",restos[index].website);
	$("#adresseresto").attr("href",restos[index].url);
	$("#adresseresto").text(restos[index].formatted_address);
	$("#numtelresto").text(restos[index].formatted_phone_number);
	$('.LienResto').attr("href",restos[index].website);
	$('#DisplayRatingStars').text(ReviewStars(index));
	
	$('#thisstars').text(ReviewStars(index));
	$(".Infobas").attr("data-id", index);
	
	var ratingval =(restos[index].rating <= 5)?(restos[index].rating +""):("0");
	ratingval =(ratingval.length==1)?(ratingval+".0"):ratingval;
	$('.rating-num').text(ratingval);
	//$("#ratingresto").text(ratingval);
	
	var items ="";
	
	/*check if open hours property exist in the json object*/
	if(restos[index].hasOwnProperty('opening_hours')){
		var estouvert = (restos[index].opening_hours.open_now)?"Ouvert":"Fermé";
		var CouleurFerme = (restos[index].opening_hours.open_now)?"green":"red"
		
		$('#EstOuvert').text(estouvert);
		$('#EstOuvert').css("color", CouleurFerme)
		var openhourslist = restos[index].opening_hours.weekday_text;

		for(var i =0; i< openhourslist.length; i++){
			items+="<div class='hoursitem'><label>"+openhourslist[i]+"</label></div>";	
		}	
		
	}else{
		items ="heures d'ouverture pas spécifiée";
		$('#EstOuvert').text("");
	}		
	items = "<div id='openhours'>"+ items +"</div>";
	$("#openhours").replaceWith(items);

	
    var res = restos[index].website.split("http://").join("");
    res = res.split("/").join("");
	$("#sitewebresto").text(res);

	var typerestolist =restos[index].types;
	var typeitems=" ";
	for(var j =0; j< typerestolist.length; j++){
		if(j ==(typerestolist.length-1)){
			typeitems += typerestolist[j];
		}else{
			typeitems += typerestolist[j]+", ";
		}
	}

	$("#typeresto").text(typeitems);
	var reviews=""; 
	var reviewslist =restos[index].reviews;
	$('.rating-total').text((reviewslist.length+" avis"));
	$(".Infobas").attr("data-index", reviewslist.length);
	
	for (var i = 0; i < reviewslist.length; i++) {
		var viewerimage= (reviewslist[i].hasOwnProperty('profile_photo_url'))?("https:"+reviewslist[i].profile_photo_url):("Images/anonymous_v3.png") ; //split("//").join("");
		reviews += "<div class='itemview'><div class='circular'><a href='"+reviewslist[i].author_url+"' target='blank'><img src='"+viewerimage+"' alt='Mountain View'></a></div><div class='Inforeviewer'>"
					+"<div class='nomreviewer'>"+reviewslist[i].author_name+"</div>"
					+"<div class='timereview'>"+reviewslist[i].relative_time_description+"</div>"
					+"<div class='ratereview'><label style='color: red'>"+ReviewStars(reviewslist[i].rating)+"</label></div>"
					+"<div class='descreview'>"+reviewslist[i].text+"</div></div></div>";	
	}
	$(".listereviews").replaceWith($("<div class='listereviews'>"+ reviews +"</div>"))
}

function is_number(x){
	return x === x+0; 
}


$( document ).ready(function() {
  $("#DonnerAvis").click( function() {
    $(".popup").css("display", "block");
	var idresto= +($(".Infobas").attr("data-id"));
	$('#adresse_name_place').text(( restos[idresto].name +", "+ restos[idresto].formatted_address));	
  });

  $(".close-image").click( function() {
    $(".popup").css("display", "none");
  });
  
     //disale button
	$('#SubmitButton').attr('disabled',true);
	
	$('[type*="radio"]').change(function () {
		var me = $(this);
		$('#log').text(me.attr('value'));
		$('#log').attr("data-id",me.attr('value'));

		if($("#log").text()) {
			$('#SubmitButton').attr('disabled', false);
		}
	});
  
  
	$("#SubmitButton").click( function() {	 
		var total = $(".Infobas").attr("data-index");
		var totalreview =(is_number(total))?test:(+total);
		$('.rating-total').text(((++totalreview)+" avis"));
		$(".Infobas").attr("data-index", totalreview);	
		var texttab = $("#CommentTab").val();
		var rate = $("#log").text();
			
		var reviewtoadd = "<div class='itemview'><div class='circular'>"
							+"<a href='https://www.google.com/maps/contrib/108513892791994728819/photos/@46.5396095,-94.9748791,5z/data=!4m3!8m2!3m1!1e1' target='blank'><img src='Images/deadpool.jpg' alt='Mountain View'></a></div><div class='Inforeviewer'>"
							+"<div class='nomreviewer'> Deadpool </div>"
							+"<div class='timereview'>a minute ago</div>"
							+"<div class='ratereview'><label style='color: red'>"+CheckStars(rate)+"</label></div>"
							+"<div class='descreview'>"+texttab+"</div></div></div>";					
		$(".listereviews").prepend(reviewtoadd);
		$(".popup").css("display", "none");

	});

 });