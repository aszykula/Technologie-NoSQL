var cursor = db.places.find()

cursor.forEach(function(input) {
  x = input.szerokosc;
  y = input.dlugosc;
  id = input._id;
  db.places.update({"_id":id},{$set:{"loc":{"type":"Point","coordinates":[y,x]}}});
});
