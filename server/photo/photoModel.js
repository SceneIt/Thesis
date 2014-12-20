var photo= {
	the_geom: null,// required CDB_latlng(43,-120) will convert it to the neccessary format for cartodb 
	description: null,
	user_id: null,
	photo_url: null //required
	//created_at will automatically update according to time on database no need to include.
}

module.exports = photo;