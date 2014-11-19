Technologie-NoSQL
=================
#*Zadanie 1a*

###Mongod

W celu zaoszczędzenia miejsca na root moją bazę uruchamiam ze zmienioną ścieżką

```sh
mongod --dbpath /home/zakrzes/NoSql/db/
```

###Oczyszczenie pliku Train.csv

Po pobraniu pliku Train.csv zawiera on zbędne znaki nowej lini w polach. Aby je usunąć używamy komendy 

```sh
cat Train.csv | tr "\n" " " | tr "\r" "\n" > Train_almost.csv
```

Teraz plik Train_almost.csv jest prawie gotowy, posiada on jednak zbędną linię na końcu, którą musimy usunąć. W tym celu do pliku Train.csv zapiszemy pierwsze 6034195 lini z pliku Train_almost.csv komendą

```sh
head -n 6034196 > Train.csv
```

Teraz kiedy plik jest oczyszczony możemy przystąpić do importu danych do bazy MongoDB.

###Import danych do bazy

####MongoDB

W celu zmierzenia czasu wykonywania importu komendę na początku komendy umieszczamy ` time `

```sh
time mongoimport -d train -c train --type csv --headerline --file Train.csv 
```

Jako wynik otrzymałem następujący wydruk w terminalu

```sh
2014-11-16T17:04:37.002+0100 check 9 6034196
2014-11-16T17:04:40.040+0100 imported 6034195 objects

real	12m38.590s
user	2m43.352s
sys		0m14.985s
```

Jak widać import trwał `12m38.590s` a do bazy zostało zaimportowane `6034195` obiektów.

![Alt text](https://raw.githubusercontent.com/zakrzes/Technologie-NoSQL/master/images/importMongo.png)

####Postgres

Na początek musimy utworzyć tabelę do której wprowadzimy nasze dane

```psql
CREATE TABLE Train(Id INT PRIMARY KEY, Title VARCHAR, Body VARCHAR, Tags VAARCHAR);
```

A następnie wykonujemy import pamiętając o kilku rzeczach

```psql
COPY Train FROM '/home/zakrzes/NoSql/Train.csv' DELIMITER ',' CSV HEADER;
```

w naszym pliku dane oddzielone sa znakiem `,` oraz plik zawiera nagłówek w tym celu dodajemy `DELIMETER ','` oraz `HEADER`

Import trwał `896168,402 ms` co po przeliczeniu daje `14,936140033` minut.

![Alt text](https://raw.githubusercontent.com/zakrzes/Technologie-NoSQL/master/images/importPostgres.png)

#*Zadanie 1b*

Sprawdzenie ilości zaimportowanych rekordów

```
> use train
switched to db train
> db.train.count()
6034195
```

#*Zadanie 1c*

Do zamiany tagów użyłem skrytpu [tags.js](./scripts/tags.js).

```sh 
time mongo tags.js 
```
####Czas

```sh
real    11m35.343s
user    4m09.122s
sys     0m5.784s
```

#*Zadanie 1d*

#### Places
importujemy dane z pliku [miasta.json](./data/miasta.json).
```mongo
time mongoimport -d places -c places --file miasta.json
```
wynik 
```mongo
connected to: 127.0.0.1
2014-11-16T19:44:28.365+0100 check 9 262
2014-11-16T19:44:28.367+0100 imported 262 objects

real	0m0.041s
user	0m0.018s
sys	 0m0.018s
```

W celu zmiany danych w punkty używamy skryptu [toPoints.js](./scripts/toPoints.js).

```mongo
mongo places toPoint.js
```

```mongo
switched to db places
> db.places.findOne()
{
	"_id" : 0,
	"szerokosc" : 52.88,
	"ludnosc" : 12540,
	"dlugosc" : 18.7,
	"miasto" : "Aleksandrów Kujawski",
	"loc" : {
		"type" : "Point",
		"coordinates" : [
			18.7,
			52.88
		]
	}
}
```

###Zapytanie 1
5 miast w ogległości 100km od Warszawy
```mongo
db.places.find({loc: {$near: {$geometry: {type: "Point", coordinates: [21.000366210937496, 52.231163984032676]}, $maxDistance: 100000}}},{_id:0,miasto:1,loc:1}).skip(1).limit(5).pretty()
```
[Mapa](./maps/zapytanie1.geojson)
###Zapytanie 2
Miasta w obrębie obszaru obejmującego(mniej więcej) wybrzerze polski
```mongo
db.places.find({
    loc: {
        $geoWithin: {
			$geometry: {
            type: "Polygon",
            coordinates: [
                [
                    [
                        19.1876220703125,
                        54.83233630197034
                    ],
                    [
                        19.2535400390625,
                        54.26843214835869
                    ],
                    [
                        18.43505859375,
                        54.271639968448014
                    ],
                    [
                        18.1549072265625,
                        54.6992335284814
                    ],
                    [
                        16.072998046875,
                        54.194583360162646
                    ],
                    [
                        14.23828125,
                        53.73896488496292
                    ],
                    [
                        14.161376953125,
                        54.33574395530071
                    ],
                    [
                        18.1549072265625,
                        54.88924640307589
                    ],
                    [
                        19.1876220703125,
                        54.83233630197034
                    ]
                ]
            ]
        }
        }
    }
}).pretty()
```
[Mapa](./maps/zapytanie2.geojson)
###Zapytanie 3
Miasta w odległości do 100km od mojego miasta rodzinnego Chojnice
```mongo
db.places.find({loc: {$near: {$geometry: {type: "Point", coordinates: [21.000366210937496, 52.231163984032676]}, $maxDistance: 100000}}})
```
[Mapa](./maps/zapytanie3.geojson)
###Zapytanie 4
Miasta w obrębie prostokąta obejmującego fragment Tatr (jedno z miejsc które lubie odwiedzać :)
```mongo
db.places.find({ loc: { $geoIntersects: {$geometry: { "type": "Polygon",
        "coordinates": [
          [
            [
              19.70947265625,
              49.17811258315209
            ],
            [
              19.70947265625,
              49.52520834197442
            ],
            [
              20.379638671875,
              49.52520834197442
            ],
            [
              20.379638671875,
              49.17811258315209
            ],
            [
              19.70947265625,
              49.17811258315209
            ]
          ]
        ]
      } } } })
```
[Mapa](./maps/zapytanie4.geojson)
###Zapytanie 5
Miasta w lini prostej pomiędzy Sopotem a Zakopanem (Trasa pociągu, którym najłatwiej dostać się w Tatry z Trójmiasta w Tatry) Niestety tylko Sopot i Zakopane :(
```mongo
db.places.find({loc: {$geoIntersects: {$geometry: {type: "LineString", coordinates: [ [18.559,54.439],  [19.959, 49.289]]}}}})
```
[Mapa](./maps/zapytanie5.geojson)
###Zapytanie 6
Miasta w Bieszczadach w odległości 50km od Sanoka (niestety Cisna, gdzie często spędzam wakacje się nie załapała :( )
```mongo
db.places.find({loc: {$near: {$geometry: {type: "Point", coordinates: [ 22.209, 49.57 ]}, $maxDistance: 50000}}}).skip(1)
```
[Mapa](./maps/zapytanie6.geojson)

