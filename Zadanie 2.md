#Zadanie 2
Na potrzeby zadania wykożystam bazę `Internet Movies Data Base` zlinkowaną na [stronie prowadzącego](http://wbzyl.inf.ug.edu.pl/nosql/)
####Import danych do bazy
```sh
time mongoimport -d imdb -c imdb --type json --file getglue_sample.json
```
```mongo
2014-11-19T21:23:12.599+0100 check 9 14001606
2014-11-19T21:23:13.277+0100 imported 14001606 objects
encountered 1 error(s)

real	16m48.848s
user	5m28.500s
sys		0m20.434s
```

Kilkukrotnie napotkałem błąd importując dane, dlatego skorzystamy z `14001606` danych które udało sie zaimportować
###Agregacja 1
10 reżyserów z największą liczbą filmów

####pymongo
```js
db.imdb.aggregate(
    { "$group": {"_id": {"dir": "$director", 'id": "$title"}, "count": {"$sum": 1}} },
    { "$group": {"_id": "$_id.dir" , "count": {"$sum": 1}} },
    { "$sort": {"count": -1} },
    { "$limit" : 10}
    );
```
    
####mongo
```js
db.imdb.aggregate(
    { $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
    { $group: {_id: "$_id.dir" , count: {$sum: 1}} },
    { $sort: {count: -1} },
    { $limit : 10}
    );
```
```mongo
{ "_id" : null, "count" : 20322 }
{ "_id" : "not available", "count" : 1254 }
{ "_id" : "alfred hitchcock", "count" : 50 }
{ "_id" : "woody allen", "count" : 48 }
{ "_id" : "various directors", "count" : 47 }
{ "_id" : "michael curtiz", "count" : 44 }
{ "_id" : "jesus franco", "count" : 42 }
{ "_id" : "takashi miike", "count" : 41 }
{ "_id" : "steven spielberg", "count" : 41 }
{ "_id" : "robert altman", "count" : 41 }
```
Jak widać w `20322 filmach` reżyser nie został podany, 
a w `1254 filmach` zostało wpisane "not available" więc te dane są mało istotne

|      Reżyser      |    Ilość    |
|:-----------------:|:-----------:|
| alfred hitchcock  |     50      |
| woody allen       |     48      |
| various directors |     47      |
| michael curtiz    |     44      |
| jesus franco      |     42      |
| takashi miike     |     41      |
| steven spielberg  |     41      |
| robert altman     |     41      |
###Agregacja2
10 najbardziej aktywnych użytkowników

####pymongo
```js
db.imdb.aggregate(
	{"$group":{"_id": "$userId", "count":{"$sum": 1}}},
	{"$sort":{"count": -1}},
	{"$limit": 10}
	);
```
####mongo
```js
db.imdb.aggregate(
	{$group:{_id: "$userId", count:{$sum: 1}}},
	{$sort:{count: -1}},
	{$limit: 10}
	);
```
```js	
{ "_id" : "zenofmac", "count" : 56233 }
{ "_id" : "cillax", "count" : 43161 }
{ "_id" : "tamtomo", "count" : 42378 }
{ "_id" : "ellen_turner", "count" : 32239 }
{ "_id" : "husainholic", "count" : 32135 }
{ "_id" : "DeniseChinita", "count" : 31263 }
{ "_id" : "Putu_Nitovic", "count" : 29895 }
{ "_id" : "SusantiBharuna", "count" : 28706 }
{ "_id" : "zbj", "count" : 28601 }
```
|    Użytkownik     |    Wpisów   |
|:-----------------:|:-----------:|
| zenofmac          |    56233    |
| cillax            |    43161    |
| tamtomo           |    42378    |
| ellen_turner      |    32239    |
| husainholic       |    32135    |
| DeniseChinita     |    31263    |
| Putu_Nitovic      |    29895    |
| SusantiBharuna    |    28706    |
| zbj               |    28601    |
Taka ilość wpisów jest bardzo imponująca.
###Agregacja3
20 najmniej popularnych filmów i seriali

####pymongo
```js
db.imdb.aggregate(
    { "$match": {"modelName": "movies" || "tv_shows"  } },
    { "$group": {"_id": "$title", "count": {"$sum": 1}} },
    { "$sort": {"count": 1} },
    { "$limit" : 20}
    );
```
###mongo
```js
db.imdb.aggregate(
    { $match: {"modelName": "movies" || "tv_shows"  } },
    { $group: {_id: "$title", count: {$sum: 1}} },
    { $sort: {count: 1} },
    { $limit : 20}
    );
```
```js
{ "_id" : "Wicked World", "count" : 1 }
{ "_id" : "Bill Burr: Why Do I Do This", "count" : 1 }
{ "_id" : "Origin: Spirits of the Past", "count" : 1 }
{ "_id" : "The Girl in the Woods", "count" : 1 }
{ "_id" : "BookWars", "count" : 1 }
{ "_id" : "Monster Thursday", "count" : 1 }
{ "_id" : "Meth", "count" : 1 }
{ "_id" : "Doctor Who: The Ribos Operation", "count" : 1 }
{ "_id" : "Facing Arthur", "count" : 1 }
{ "_id" : "Dirt", "count" : 1 }
{ "_id" : "Gore-e-ography: The Making of Death Harmony", "count" : 1 }
{ "_id" : "The Lost Face", "count" : 1 }
{ "_id" : "Enemies Among Us", "count" : 1 }
{ "_id" : "Addiction Is Murder", "count" : 1 }
{ "_id" : "Da san yuan", "count" : 1 }
{ "_id" : "Am I Evil", "count" : 1 }
{ "_id" : "Family Secret", "count" : 1 }
{ "_id" : "Severe Clear", "count" : 1 }
{ "_id" : "Sledgehammer", "count" : 1 }
{ "_id" : "The White Face", "count" : 1 }
```
|    Film/serial    |    Ilość    |
|:-----------------:|:-----------:|
| Wicked World      |      1      |
| Bill Burr...      |      1      |
| Origin...         |      1      |
| The Girl...       |      1      |
| BookWars          |      1      |
| Monster Thursday  |      1      |
| Meth              |      1      |
| Facing Arthur     |      1      |
| Dirt              |      1      |
| Gore-e-ography    |      1      |
oraz inne.
###Agregacja4
15 użytkowników z najmniejszą liczbą negatywnych komentarzy

####pymongo
```js
db.imdb.aggregate(
	{ "$match": { "action": "Disliked" }},
	{ "$group": { "_id": "$userId", "count": {"$sum": 1} } },
	{ "$sort": { "count": 1 } },
	{ "$limit": 15 }
	);
```

###mongo
```js
db.imdb.aggregate(
	{ $match: { "action": "Disliked" }},
	{ $group: { _id: "$userId", count: {$sum: 1} } },
	{ $sort: { count: 1 } },
	{ $limit: 15 } 
	);
```
```js
{ "_id" : "fakeplastictrees", "count" : 1 }
{ "_id" : "maya_harris", "count" : 1 }
{ "_id" : "seocrispim", "count" : 1 }
{ "_id" : "dtmadera", "count" : 1 }
{ "_id" : "boyd_bentley", "count" : 1 }
{ "_id" : "katie_callahan1", "count" : 1 }
{ "_id" : "emably", "count" : 1 }
{ "_id" : "yaratropea", "count" : 1 }
{ "_id" : "wellingtonbios", "count" : 1 }
{ "_id" : "salthxskobra", "count" : 1 }
{ "_id" : "Skibop", "count" : 1 }
{ "_id" : "andrea_rivas1", "count" : 1 }
{ "_id" : "kpietromica", "count" : 1 }
{ "_id" : "allan_richard", "count" : 1 }
{ "_id" : "overnova", "count" : 1 }
```

|    Użytkownik     |    Ilość    |
|:-----------------:|:-----------:|
| fakeplastictrees  |      1      |
| maya_harris       |      1      |
| seocrispim        |      1      |
| dtmadera          |      1      |
| boyd_bentley      |      1      |
| katie_callahan1   |      1      |
| emably            |      1      |
| yaratropea        |      1      |
| wellingtonbios    |      1      |
| salthxskobra      |      1      |
oraz inne.
