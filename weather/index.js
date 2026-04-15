// Cultiva Weather Plugin v1.6.0
// Weather: Open-Meteo · Russia: built-in city database · World: Open-Meteo Geocoding

class WeatherPlugin {
  constructor(context, hooks) {
    this.context = context;
    this.hooks = hooks;
    this.settings = {
      city: 'Moscow',
      units: 'celsius',
      showInGarden: true,
      lat: 55.7558,
      lon: 37.6173
    };
    this.weatherData = null;
    this.updateInterval = null;
    this.searchTimeout = null;

    this.popularCities = [
      { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173 },
      { name: 'Saint Petersburg', country: 'Russia', lat: 59.9343, lon: 30.3351 },
      { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
      { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
      { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
      { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050 },
      { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
      { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
      { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
      { name: 'Beijing', country: 'China', lat: 39.9042, lon: 116.4074 },
      { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
      { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 }
    ];

 this.russianCities = [
        { name: 'Abaza', lat: 52.655, lon: 90.083 },
        { name: 'Abakan', lat: 53.716, lon: 91.429 },
        { name: 'Abdulino', lat: 53.683, lon: 53.65 },
        { name: 'Abinsk', lat: 44.866, lon: 38.15 },
        { name: 'Achinsk', lat: 56.283, lon: 90.5 },
        { name: 'Adygeysk', lat: 44.883, lon: 39.183 },
        { name: 'Agidel', lat: 55.9, lon: 53.933 },
        { name: 'Agryz', lat: 56.516, lon: 53.0 },
        { name: 'Ak-Dovurak', lat: 51.183, lon: 90.6 },
        { name: 'Akhtubinsk', lat: 48.283, lon: 46.166 },
        { name: 'Aksay', lat: 47.266, lon: 39.866 },
        { name: 'Alagir', lat: 43.033, lon: 44.216 },
        { name: 'Alapayevsk', lat: 57.85, lon: 61.7 },
        { name: 'Alatyr', lat: 54.85, lon: 46.583 },
        { name: 'Aldan', lat: 58.6, lon: 125.383 },
        { name: 'Aleksandrov', lat: 56.4, lon: 38.716 },
        { name: 'Aleksandrovsk', lat: 59.166, lon: 57.583 },
        { name: 'Aleksandrovsk-Sakhalinsky', lat: 50.9, lon: 142.15 },
        { name: 'Alekseyevka', lat: 50.65, lon: 38.683 },
        { name: 'Aleksin', lat: 54.5, lon: 37.066 },
        { name: 'Aleysk', lat: 52.5, lon: 82.783 },
        { name: 'Almetyevsk', lat: 54.9, lon: 52.3 },
        { name: 'Alzamay', lat: 55.55, lon: 98.65 },
        { name: 'Amursk', lat: 50.233, lon: 136.9 },
        { name: 'Anadyr', lat: 64.733, lon: 177.5 },
        { name: 'Anapa', lat: 44.883, lon: 37.316 },
        { name: 'Andreapol', lat: 56.65, lon: 32.266 },
        { name: 'Angarsk', lat: 52.566, lon: 103.916 },
        { name: 'Anzhero-Sudzhensk', lat: 56.083, lon: 86.033 },
        { name: 'Apatity', lat: 67.566, lon: 33.4 },
        { name: 'Aprelevka', lat: 55.533, lon: 37.05 },
        { name: 'Apsheronsk', lat: 44.466, lon: 39.733 },
        { name: 'Aramil', lat: 56.7, lon: 60.833 },
        { name: 'Ardon', lat: 43.166, lon: 44.283 },
        { name: 'Argun', lat: 43.3, lon: 45.866 },
        { name: 'Arkadak', lat: 51.933, lon: 43.5 },
        { name: 'Arkhangelsk', lat: 64.55, lon: 40.533 },
        { name: 'Armavir', lat: 44.983, lon: 41.116 },
        { name: 'Arsenyev', lat: 44.166, lon: 133.266 },
        { name: 'Arsk', lat: 56.1, lon: 49.883 },
        { name: 'Artyom', lat: 43.35, lon: 132.183 },
        { name: 'Artyomovsk', lat: 54.35, lon: 93.433 },
        { name: 'Arzamas', lat: 55.4, lon: 43.816 },
        { name: 'Asbest', lat: 57.0, lon: 61.466 },
        { name: 'Asha', lat: 55.0, lon: 57.25 },
        { name: 'Asino', lat: 57.0, lon: 86.15 },
        { name: 'Astrakhan', lat: 46.35, lon: 48.05 },
        { name: 'Atkarsk', lat: 51.866, lon: 45.0 },
        { name: 'Aznakayevo', lat: 54.85, lon: 53.066 },
        { name: 'Azov', lat: 47.1, lon: 39.416 },
        { name: 'Babayevo', lat: 59.383, lon: 35.933 },
        { name: 'Babushkin', lat: 51.716, lon: 105.866 },
        { name: 'Bagrationovsk', lat: 54.383, lon: 20.633 },
        { name: 'Bakal', lat: 54.933, lon: 58.8 },
        { name: 'Baksan', lat: 43.683, lon: 43.533 },
        { name: 'Balabanovo', lat: 55.183, lon: 36.65 },
        { name: 'Balakovo', lat: 52.033, lon: 47.783 },
        { name: 'Balashikha', lat: 55.8, lon: 37.95 },
        { name: 'Balashov', lat: 51.55, lon: 43.166 },
        { name: 'Baley', lat: 51.583, lon: 116.633 },
        { name: 'Baltiysk', lat: 54.65, lon: 19.916 },
        { name: 'Barabinsk', lat: 55.35, lon: 78.35 },
        { name: 'Barnaul', lat: 53.35, lon: 83.766 },
        { name: 'Barysh', lat: 53.65, lon: 47.116 },
        { name: 'Bataysk', lat: 47.133, lon: 39.75 },
        { name: 'Bavly', lat: 54.4, lon: 53.25 },
        { name: 'Baykalsk', lat: 51.516, lon: 104.133 },
        { name: 'Baymak', lat: 52.583, lon: 58.316 },
        { name: 'Belaya Kalitva', lat: 48.183, lon: 40.766 },
        { name: 'Belaya Kholunitsa', lat: 58.833, lon: 50.85 },
        { name: 'Belebey', lat: 54.1, lon: 54.116 },
        { name: 'Belgorod', lat: 50.6, lon: 36.6 },
        { name: 'Belinsky', lat: 52.966, lon: 43.416 },
        { name: 'Belogorsk', lat: 50.916, lon: 128.466 },
        { name: 'Belokurikha', lat: 52.0, lon: 84.983 },
        { name: 'Belomorsk', lat: 64.516, lon: 34.766 },
        { name: 'Belorechensk', lat: 44.766, lon: 39.866 },
        { name: 'Beloretsk', lat: 53.966, lon: 58.4 },
        { name: 'Belousovo', lat: 55.083, lon: 36.666 },
        { name: 'Belovo', lat: 54.416, lon: 86.3 },
        { name: 'Beloyarsky', lat: 63.716, lon: 66.666 },
        { name: 'Belozersk', lat: 60.033, lon: 37.783 },
        { name: 'Bely', lat: 55.833, lon: 32.933 },
        { name: 'Berdsk', lat: 54.75, lon: 83.1 },
        { name: 'Berezniki', lat: 59.416, lon: 56.783 },
        { name: 'Berezovsky', lat: 56.016, lon: 93.116 },
        { name: 'Beslan', lat: 43.183, lon: 44.533 },
        { name: 'Bezhetsk', lat: 57.766, lon: 36.7 },
        { name: 'Bikin', lat: 46.816, lon: 134.25 },
        { name: 'Bilibino', lat: 68.05, lon: 166.45 },
        { name: 'Birobidzhan', lat: 48.783, lon: 132.933 },
        { name: 'Birsk', lat: 55.416, lon: 55.533 },
        { name: 'Biryuch', lat: 50.516, lon: 38.4 },
        { name: 'Bisert', lat: 56.85, lon: 59.05 },
        { name: 'Biysk', lat: 52.533, lon: 85.2 },
        { name: 'Blagodarny', lat: 45.1, lon: 43.433 },
        { name: 'Blagoveshchensk', lat: 50.266, lon: 127.533 },
        { name: 'Bobrov', lat: 51.1, lon: 40.033 },
        { name: 'Bodaybo', lat: 57.85, lon: 114.2 },
        { name: 'Bogdanovich', lat: 56.766, lon: 62.05 },
        { name: 'Bogoroditsk', lat: 53.766, lon: 38.116 },
        { name: 'Bogorodsk', lat: 56.1, lon: 43.516 },
        { name: 'Bogotol', lat: 56.2, lon: 89.516 },
        { name: 'Boguchar', lat: 49.933, lon: 40.55 },
        { name: 'Boksitogorsk', lat: 59.466, lon: 33.85 },
        { name: 'Bolgar', lat: 54.95, lon: 49.066 },
        { name: 'Bolkhov', lat: 53.433, lon: 36.0 },
        { name: 'Bologoye', lat: 57.883, lon: 34.05 },
        { name: 'Bolokhovo', lat: 54.083, lon: 37.816 },
        { name: 'Bolotnoye', lat: 55.666, lon: 84.4 },
        { name: 'Bolshoy Kamen', lat: 43.116, lon: 132.35 },
        { name: 'Bor', lat: 56.35, lon: 44.066 },
        { name: 'Borisoglebsk', lat: 51.366, lon: 42.083 },
        { name: 'Borodino', lat: 55.9, lon: 94.9 },
        { name: 'Borovichi', lat: 58.4, lon: 33.916 },
        { name: 'Borovsk', lat: 55.2, lon: 36.483 },
        { name: 'Borzaya', lat: 50.383, lon: 116.516 },
        { name: 'Bratsk', lat: 56.133, lon: 101.616 },
        { name: 'Bronnitsy', lat: 55.416, lon: 38.266 },
        { name: 'Bryansk', lat: 53.25, lon: 34.366 },
        { name: 'Budyonnovsk', lat: 44.783, lon: 44.166 },
        { name: 'Bugulma', lat: 54.533, lon: 52.8 },
        { name: 'Buguruslan', lat: 53.616, lon: 52.416 },
        { name: 'Buinsk', lat: 54.966, lon: 48.283 },
        { name: 'Buturlinovka', lat: 50.816, lon: 40.6 },
        { name: 'Buy', lat: 58.483, lon: 41.516 },
        { name: 'Buynaksk', lat: 42.816, lon: 47.116 },
        { name: 'Buzuluk', lat: 52.783, lon: 52.25 },
        { name: 'Chadan', lat: 51.283, lon: 91.583 },
        { name: 'Chapayevsk', lat: 52.983, lon: 49.716 },
        { name: 'Chaplygin', lat: 53.233, lon: 39.966 },
        { name: 'Chaykovsky', lat: 56.766, lon: 54.116 },
        { name: 'Chebarkul', lat: 54.983, lon: 60.366 },
        { name: 'Cheboksary', lat: 56.133, lon: 47.25 },
        { name: 'Chegem', lat: 43.566, lon: 43.583 },
        { name: 'Chekalin', lat: 54.1, lon: 36.25 },
        { name: 'Chekhov', lat: 55.15, lon: 37.466 },
        { name: 'Chelyabinsk', lat: 55.15, lon: 61.4 },
        { name: 'Cherdyn', lat: 60.4, lon: 56.483 },
        { name: 'Cheremkhovo', lat: 53.15, lon: 103.066 },
        { name: 'Cherepanovo', lat: 54.216, lon: 83.366 },
        { name: 'Cherepovets', lat: 59.133, lon: 37.9 },
        { name: 'Cherkessk', lat: 44.216, lon: 42.05 },
        { name: 'Chermoz', lat: 58.783, lon: 56.15 },
        { name: 'Chernogolovka', lat: 56.0, lon: 38.366 },
        { name: 'Chernogorsk', lat: 53.816, lon: 91.283 },
        { name: 'Chernushka', lat: 56.5, lon: 56.083 },
        { name: 'Chernyakhovsk', lat: 54.633, lon: 21.816 },
        { name: 'Chistopol', lat: 55.366, lon: 50.633 },
        { name: 'Chita', lat: 52.033, lon: 113.5 },
        { name: 'Chkalovsk', lat: 56.766, lon: 43.25 },
        { name: 'Chudovo', lat: 59.116, lon: 31.683 },
        { name: 'Chukhloma', lat: 58.75, lon: 42.683 },
        { name: 'Chulym', lat: 55.1, lon: 80.966 },
        { name: 'Chusovoy', lat: 58.283, lon: 57.816 },
        { name: 'Dagestanskiye Ogni', lat: 42.116, lon: 48.2 },
        { name: 'Dalmatovo', lat: 56.266, lon: 62.933 },
        { name: 'Dalnegorsk', lat: 44.566, lon: 135.566 },
        { name: 'Dalnerechensk', lat: 45.933, lon: 133.733 },
        { name: 'Danilov', lat: 58.183, lon: 40.183 },
        { name: 'Dankov', lat: 53.25, lon: 39.15 },
        { name: 'Davlekanovo', lat: 54.216, lon: 55.033 },
        { name: 'Dedovsk', lat: 55.866, lon: 37.133 },
        { name: 'Degtyarsk', lat: 56.7, lon: 60.083 },
        { name: 'Demidov', lat: 55.266, lon: 31.516 },
        { name: 'Derbent', lat: 42.066, lon: 48.3 },
        { name: 'Desnogorsk', lat: 54.15, lon: 33.283 },
        { name: 'Digora', lat: 43.15, lon: 44.15 },
        { name: 'Dimitrovgrad', lat: 54.216, lon: 49.6 },
        { name: 'Divnogorsk', lat: 55.95, lon: 92.383 },
        { name: 'Dmitriyev-Lgovsky', lat: 52.133, lon: 35.066 },
        { name: 'Dmitrov', lat: 56.35, lon: 37.533 },
        { name: 'Dmitrovsk', lat: 52.5, lon: 35.15 },
        { name: 'Dno', lat: 57.833, lon: 29.966 },
        { name: 'Dobryanka', lat: 58.45, lon: 56.416 },
        { name: 'Dolgoprudny', lat: 55.933, lon: 37.5 },
        { name: 'Dolinsk', lat: 47.316, lon: 142.8 },
        { name: 'Domodedovo', lat: 55.433, lon: 37.75 },
        { name: 'Donetsk', lat: 48.35, lon: 39.95 },
        { name: 'Donskoy', lat: 53.966, lon: 38.316 },
        { name: 'Dorogobuzh', lat: 54.916, lon: 33.3 },
        { name: 'Drezna', lat: 55.75, lon: 38.85 },
        { name: 'Dubna', lat: 56.733, lon: 37.166 },
        { name: 'Dubovka', lat: 49.05, lon: 44.833 },
        { name: 'Dudinka', lat: 69.4, lon: 86.166 },
        { name: 'Dukhovshchina', lat: 55.2, lon: 32.416 },
        { name: 'Dyatkovo', lat: 53.6, lon: 34.333 },
        { name: 'Dyurtyuli', lat: 55.483, lon: 54.866 },
        { name: 'Dzerzhinsk', lat: 56.233, lon: 43.45 },
        { name: 'Dzerzhinsky', lat: 55.633, lon: 37.85 },
        { name: 'Elektrogorsk', lat: 55.883, lon: 38.783 },
        { name: 'Elektrostal', lat: 55.783, lon: 38.45 },
        { name: 'Elektrougli', lat: 55.716, lon: 38.216 },
        { name: 'Elista', lat: 46.316, lon: 44.266 },
        { name: 'Engels', lat: 51.5, lon: 46.116 },
        { name: 'Ertil', lat: 51.833, lon: 40.8 },
        { name: 'Fatezh', lat: 52.083, lon: 35.85 },
        { name: 'Fokino', lat: 53.45, lon: 34.416 },
        { name: 'Frolovo', lat: 49.766, lon: 43.65 },
        { name: 'Fryazino', lat: 55.95, lon: 38.033 },
        { name: 'Furmanov', lat: 57.25, lon: 41.1 },
        { name: 'Gadzhiyevo', lat: 69.25, lon: 33.316 },
        { name: 'Gagarin', lat: 55.55, lon: 35.0 },
        { name: 'Galich', lat: 58.383, lon: 42.35 },
        { name: 'Gatchina', lat: 59.566, lon: 30.133 },
        { name: 'Gavrilov Posad', lat: 56.566, lon: 40.116 },
        { name: 'Gavrilov-Yam', lat: 57.3, lon: 39.85 },
        { name: 'Gay', lat: 51.466, lon: 58.45 },
        { name: 'Gdov', lat: 58.75, lon: 27.816 },
        { name: 'Gelendzhik', lat: 44.566, lon: 38.083 },
        { name: 'Georgiyevsk', lat: 44.15, lon: 43.466 },
        { name: 'Glazov', lat: 58.133, lon: 52.666 },
        { name: 'Golitsyno', lat: 55.616, lon: 36.983 },
        { name: 'Gorbatov', lat: 56.133, lon: 43.066 },
        { name: 'Gorno-Altaysk', lat: 51.95, lon: 85.966 },
        { name: 'Gornozavodsk', lat: 58.383, lon: 58.316 },
        { name: 'Gornyak', lat: 51.0, lon: 81.466 },
        { name: 'Gorodets', lat: 56.65, lon: 43.466 },
        { name: 'Gorodishche', lat: 53.266, lon: 45.7 },
        { name: 'Gorodovikovsk', lat: 46.083, lon: 41.933 },
        { name: 'Gorokhovets', lat: 56.2, lon: 42.7 },
        { name: 'Goryachy Klyuch', lat: 44.633, lon: 39.133 },
        { name: 'Grayvoron', lat: 50.483, lon: 35.666 },
        { name: 'Gremyachinsk', lat: 58.566, lon: 57.833 },
        { name: 'Grozny', lat: 43.316, lon: 45.683 },
        { name: 'Gryazi', lat: 52.5, lon: 39.933 },
        { name: 'Gryazovets', lat: 58.883, lon: 40.25 },
        { name: 'Gubakha', lat: 58.866, lon: 57.583 },
        { name: 'Gubkin', lat: 51.283, lon: 37.55 },
        { name: 'Gubkinsky', lat: 64.433, lon: 76.5 },
        { name: 'Gudermes', lat: 43.35, lon: 46.1 },
        { name: 'Gukovo', lat: 48.05, lon: 39.933 },
        { name: 'Gulkevichi', lat: 45.35, lon: 40.683 },
        { name: 'Guryevsk', lat: 54.283, lon: 85.933 },
        { name: 'Gus-Khrustalny', lat: 55.616, lon: 40.666 },
        { name: 'Gusev', lat: 54.583, lon: 22.2 },
        { name: 'Gusinoozersk', lat: 51.283, lon: 106.516 },
        { name: 'Gvardeysk', lat: 54.65, lon: 21.066 },
        { name: 'Igarka', lat: 67.466, lon: 86.566 },
        { name: 'Ilansky', lat: 56.233, lon: 96.066 },
        { name: 'Innopolis', lat: 55.75, lon: 48.75 },
        { name: 'Insar', lat: 53.866, lon: 44.366 },
        { name: 'Inta', lat: 66.033, lon: 60.133 },
        { name: 'Inza', lat: 53.85, lon: 46.35 },
        { name: 'Ipatovo', lat: 45.716, lon: 42.9 },
        { name: 'Irbit', lat: 57.666, lon: 63.066 },
        { name: 'Irkutsk', lat: 52.283, lon: 104.3 },
        { name: 'Ishim', lat: 56.116, lon: 69.5 },
        { name: 'Ishimbay', lat: 53.45, lon: 56.033 },
        { name: 'Isilkul', lat: 54.916, lon: 71.266 },
        { name: 'Iskitim', lat: 54.633, lon: 83.3 },
        { name: 'Istra', lat: 55.916, lon: 36.866 },
        { name: 'Ivangorod', lat: 59.366, lon: 28.216 },
        { name: 'Ivanovo', lat: 57.0, lon: 41.0 },
        { name: 'Ivanteyevka', lat: 55.983, lon: 37.933 },
        { name: 'Ivdel', lat: 60.683, lon: 60.433 },
        { name: 'Izberbash', lat: 42.566, lon: 47.866 },
        { name: 'Izhevsk', lat: 56.85, lon: 53.216 },
        { name: 'Izobilny', lat: 45.366, lon: 41.716 },
        { name: 'Kachkanar', lat: 58.7, lon: 59.483 },
        { name: 'Kadnikov', lat: 59.5, lon: 40.266 },
        { name: 'Kalach', lat: 50.416, lon: 41.016 },
        { name: 'Kalach-na-Donu', lat: 48.683, lon: 43.533 },
        { name: 'Kaliningrad', lat: 54.716, lon: 20.5 },
        { name: 'Kalininsk', lat: 51.5, lon: 44.466 },
        { name: 'Kaltan', lat: 53.516, lon: 87.266 },
        { name: 'Kaluga', lat: 54.516, lon: 36.266 },
        { name: 'Kalyazin', lat: 57.233, lon: 37.85 },
        { name: 'Kambarka', lat: 56.266, lon: 54.2 },
        { name: 'Kamenka', lat: 53.183, lon: 44.05 },
        { name: 'Kamen-na-Obi', lat: 53.8, lon: 81.333 },
        { name: 'Kamennogorsk', lat: 60.95, lon: 29.133 },
        { name: 'Kamensk-Shakhtinsky', lat: 48.316, lon: 40.266 },
        { name: 'Kamensk-Uralsky', lat: 56.416, lon: 61.933 },
        { name: 'Kameshkovo', lat: 56.35, lon: 41.0 },
        { name: 'Kamyshin', lat: 50.083, lon: 45.4 },
        { name: 'Kamyshlov', lat: 56.85, lon: 62.716 },
        { name: 'Kamyzyak', lat: 46.116, lon: 48.083 },
        { name: 'Kanash', lat: 55.516, lon: 47.5 },
        { name: 'Kandalaksha', lat: 67.15, lon: 32.416 },
        { name: 'Kansk', lat: 56.2, lon: 95.716 },
        { name: 'Karabanovo', lat: 56.316, lon: 38.7 },
        { name: 'Karabash', lat: 55.483, lon: 60.2 },
        { name: 'Karabulak', lat: 43.3, lon: 44.9 },
        { name: 'Karachayevsk', lat: 43.766, lon: 41.9 },
        { name: 'Karachev', lat: 53.116, lon: 34.983 },
        { name: 'Karasuk', lat: 53.733, lon: 78.033 },
        { name: 'Kargat', lat: 55.2, lon: 80.283 },
        { name: 'Kargopol', lat: 61.5, lon: 38.933 },
        { name: 'Karpinsk', lat: 59.766, lon: 60.0 },
        { name: 'Kartaly', lat: 53.05, lon: 60.65 },
        { name: 'Kashin', lat: 57.366, lon: 37.616 },
        { name: 'Kashira', lat: 54.833, lon: 38.15 },
        { name: 'Kasimov', lat: 54.933, lon: 41.4 },
        { name: 'Kasli', lat: 55.883, lon: 60.75 },
        { name: 'Kaspijsk', lat: 42.883, lon: 47.633 },
        { name: 'Katav-Ivanovsk', lat: 54.75, lon: 58.2 },
        { name: 'Kataysk', lat: 56.283, lon: 62.583 },
        { name: 'Kazan', lat: 55.783, lon: 49.116 },
        { name: 'Kedrovy', lat: 57.566, lon: 79.566 },
        { name: 'Kem', lat: 64.95, lon: 34.6 },
        { name: 'Kemerovo', lat: 55.333, lon: 86.083 },
        { name: 'Kharabali', lat: 47.4, lon: 47.25 },
        { name: 'Kharovsk', lat: 59.95, lon: 40.2 },
        { name: 'Khasavyurt', lat: 43.25, lon: 46.583 },
        { name: 'Khilok', lat: 51.366, lon: 110.45 },
        { name: 'Khimki', lat: 55.9, lon: 37.45 },
        { name: 'Kholm', lat: 57.15, lon: 31.183 },
        { name: 'Kholmsk', lat: 47.05, lon: 142.05 },
        { name: 'Khotkovo', lat: 56.25, lon: 37.983 },
        { name: 'Khvalynsk', lat: 52.483, lon: 48.1 },
        { name: 'Kimovsk', lat: 53.966, lon: 38.533 },
        { name: 'Kimry', lat: 56.866, lon: 37.35 },
        { name: 'Kinel', lat: 53.233, lon: 50.616 },
        { name: 'Kinel-Cherkasy', lat: 53.466, lon: 51.516 },
        { name: 'Kineshma', lat: 57.45, lon: 42.15 },
        { name: 'Kingisepp', lat: 59.366, lon: 28.6 },
        { name: 'Kirensk', lat: 57.783, lon: 108.116 },
        { name: 'Kireyevsk', lat: 53.933, lon: 37.933 },
        { name: 'Kirillov', lat: 59.866, lon: 38.383 },
        { name: 'Kirishi', lat: 59.45, lon: 32.016 },
        { name: 'Kirov', lat: 58.6, lon: 49.65 },
        { name: 'Kirovgrad', lat: 57.433, lon: 60.066 },
        { name: 'Kirovo-Chepetsk', lat: 58.55, lon: 50.033 },
        { name: 'Kirovsk', lat: 67.616, lon: 33.666 },
        { name: 'Kirs', lat: 59.333, lon: 52.25 },
        { name: 'Kirsanov', lat: 52.65, lon: 42.733 },
        { name: 'Kiselevsk', lat: 54.0, lon: 86.633 },
        { name: 'Kislovodsk', lat: 43.9, lon: 42.716 },
        { name: 'Kizel', lat: 59.05, lon: 57.65 },
        { name: 'Kizilyurt', lat: 43.2, lon: 46.866 },
        { name: 'Kizlyar', lat: 43.85, lon: 46.716 },
        { name: 'Klimovsk', lat: 55.366, lon: 37.533 },
        { name: 'Klin', lat: 56.333, lon: 36.733 },
        { name: 'Klintsy', lat: 52.75, lon: 32.233 },
        { name: 'Knyaginino', lat: 55.816, lon: 45.033 },
        { name: 'Kodinsk', lat: 58.683, lon: 99.183 },
        { name: 'Kogalym', lat: 62.266, lon: 74.483 },
        { name: 'Kokhma', lat: 56.933, lon: 41.083 },
        { name: 'Kola', lat: 68.883, lon: 33.016 },
        { name: 'Kolchugino', lat: 56.3, lon: 39.383 },
        { name: 'Kologriv', lat: 58.816, lon: 44.316 },
        { name: 'Kolomna', lat: 55.083, lon: 38.783 },
        { name: 'Kolpashevo', lat: 58.316, lon: 82.916 },
        { name: 'Kolpino', lat: 59.75, lon: 30.6 },
        { name: 'Kommunar', lat: 59.616, lon: 30.4 },
        { name: 'Komsomolsk', lat: 57.033, lon: 40.383 },
        { name: 'Komsomolsk-on-Amur', lat: 50.55, lon: 137.0 },
        { name: 'Konakovo', lat: 56.7, lon: 36.766 },
        { name: 'Kondopoga', lat: 62.2, lon: 34.266 },
        { name: 'Kondrovo', lat: 54.8, lon: 35.933 },
        { name: 'Konstantinovsk', lat: 47.583, lon: 41.1 },
        { name: 'Kopeysk', lat: 55.1, lon: 61.616 },
        { name: 'Korablino', lat: 53.916, lon: 40.016 },
        { name: 'Korenovsk', lat: 45.466, lon: 39.45 },
        { name: 'Korkino', lat: 54.883, lon: 61.4 },
        { name: 'Korocha', lat: 50.816, lon: 37.2 },
        { name: 'Korolyov', lat: 55.916, lon: 37.816 },
        { name: 'Korsakov', lat: 46.633, lon: 142.783 },
        { name: 'Koryazhma', lat: 61.3, lon: 47.166 },
        { name: 'Kosterovo', lat: 55.933, lon: 39.633 },
        { name: 'Kostomuksha', lat: 64.583, lon: 30.6 },
        { name: 'Kostroma', lat: 57.766, lon: 40.933 },
        { name: 'Kotelniki', lat: 55.65, lon: 37.85 },
        { name: 'Kotelnikovo', lat: 47.633, lon: 43.133 },
        { name: 'Kotelnich', lat: 58.3, lon: 48.333 },
        { name: 'Kotlas', lat: 61.25, lon: 46.65 },
        { name: 'Kotovo', lat: 50.316, lon: 44.8 },
        { name: 'Kotovsk', lat: 52.583, lon: 41.5 },
        { name: 'Kovdor', lat: 67.566, lon: 30.466 },
        { name: 'Kovrov', lat: 56.366, lon: 41.316 },
        { name: 'Kovylkino', lat: 54.033, lon: 43.916 },
        { name: 'Kozelsk', lat: 54.033, lon: 35.783 },
        { name: 'Kozlovka', lat: 55.833, lon: 48.25 },
        { name: 'Kozmodemyansk', lat: 56.333, lon: 46.566 },
        { name: 'Krasavino', lat: 60.966, lon: 46.483 },
        { name: 'Krasnoarmeysk', lat: 51.016, lon: 45.7 },
        { name: 'Krasnodar', lat: 45.033, lon: 38.983 },
        { name: 'Krasnogorsk', lat: 55.833, lon: 37.316 },
        { name: 'Krasnokamensk', lat: 50.1, lon: 118.033 },
        { name: 'Krasnokamsk', lat: 58.083, lon: 55.75 },
        { name: 'Krasnoslobodsk', lat: 54.433, lon: 43.783 },
        { name: 'Krasnoturinsk', lat: 59.766, lon: 60.2 },
        { name: 'Krasnoufimsk', lat: 56.616, lon: 57.766 },
        { name: 'Krasnouralsk', lat: 58.35, lon: 60.05 },
        { name: 'Krasnousolsky', lat: 53.9, lon: 56.483 },
        { name: 'Krasnovishersk', lat: 60.4, lon: 57.066 },
        { name: 'Krasnoyarsk', lat: 56.016, lon: 92.866 },
        { name: 'Krasnoye Selo', lat: 59.733, lon: 30.083 },
        { name: 'Krasnozavodsk', lat: 56.45, lon: 38.216 },
        { name: 'Krasnoznamensk', lat: 54.95, lon: 22.5 },
        { name: 'Krasny Kut', lat: 50.95, lon: 46.966 },
        { name: 'Krasny Sulin', lat: 47.883, lon: 40.066 },
        { name: 'Krasny Yar', lat: 55.383, lon: 50.933 },
        { name: 'Kremyonki', lat: 54.883, lon: 37.116 },
        { name: 'Kronstadt', lat: 60.0, lon: 29.766 },
        { name: 'Kropotkin', lat: 45.433, lon: 40.566 },
        { name: 'Krymsk', lat: 44.933, lon: 38.0 },
        { name: 'Kstovo', lat: 56.15, lon: 44.2 },
        { name: 'Kubinka', lat: 55.583, lon: 36.7 },
        { name: 'Kudrovo', lat: 60.0, lon: 30.5 },
        { name: 'Kudymkar', lat: 59.016, lon: 54.666 },
        { name: 'Kulebaki', lat: 55.416, lon: 42.516 },
        { name: 'Kumertau', lat: 52.766, lon: 55.783 },
        { name: 'Kungur', lat: 57.433, lon: 56.95 },
        { name: 'Kupino', lat: 54.366, lon: 77.3 },
        { name: 'Kurchatov', lat: 51.666, lon: 35.65 },
        { name: 'Kurgan', lat: 55.45, lon: 65.333 },
        { name: 'Kurganinsk', lat: 44.883, lon: 40.6 },
        { name: 'Kurilsk', lat: 45.233, lon: 147.883 },
        { name: 'Kurlovo', lat: 55.45, lon: 40.616 },
        { name: 'Kurovskoye', lat: 55.583, lon: 38.916 },
        { name: 'Kursk', lat: 51.733, lon: 36.183 },
        { name: 'Kurtamysh', lat: 54.9, lon: 64.433 },
        { name: 'Kusa', lat: 55.333, lon: 59.433 },
        { name: 'Kushva', lat: 58.283, lon: 59.733 },
        { name: 'Kuvandyk', lat: 51.483, lon: 57.35 },
        { name: 'Kuybyshev', lat: 55.45, lon: 78.316 },
        { name: 'Kuznetsk', lat: 53.116, lon: 46.6 },
        { name: 'Kyakhta', lat: 50.35, lon: 106.45 },
        { name: 'Kyshtym', lat: 55.7, lon: 60.55 },
        { name: 'Kyzyl', lat: 51.716, lon: 94.45 },
        { name: 'Labinsk', lat: 44.633, lon: 40.733 },
        { name: 'Labytnangi', lat: 66.65, lon: 66.4 },
        { name: 'Ladushkin', lat: 54.566, lon: 20.166 },
        { name: 'Lagan', lat: 45.4, lon: 47.366 },
        { name: 'Laishevo', lat: 55.4, lon: 49.55 },
        { name: 'Lakhdenpokhya', lat: 61.516, lon: 30.2 },
        { name: 'Lakinsk', lat: 56.016, lon: 39.95 },
        { name: 'Langepas', lat: 61.25, lon: 75.166 },
        { name: 'Lebyazhye', lat: 54.6, lon: 64.783 },
        { name: 'Leninogorsk', lat: 54.6, lon: 52.45 },
        { name: 'Leninsk', lat: 48.7, lon: 45.2 },
        { name: 'Leninsk-Kuznetsky', lat: 54.65, lon: 86.166 },
        { name: 'Lensk', lat: 60.716, lon: 114.9 },
        { name: 'Lermontov', lat: 44.1, lon: 42.966 },
        { name: 'Lesnoy', lat: 58.633, lon: 59.783 },
        { name: 'Lesosibirsk', lat: 58.233, lon: 92.483 },
        { name: 'Lesozavodsk', lat: 45.466, lon: 133.4 },
        { name: 'Lgov', lat: 51.683, lon: 35.266 },
        { name: 'Likhoslavl', lat: 57.116, lon: 35.466 },
        { name: 'Likino-Dulyovo', lat: 55.716, lon: 38.95 },
        { name: 'Lipetsk', lat: 52.6, lon: 39.6 },
        { name: 'Lipki', lat: 53.95, lon: 37.7 },
        { name: 'Liski', lat: 50.983, lon: 39.5 },
        { name: 'Liven', lat: 52.416, lon: 37.6 },
        { name: 'Lobnya', lat: 56.016, lon: 37.483 },
        { name: 'Lodeynoye Pole', lat: 60.733, lon: 33.55 },
        { name: 'Lomonosov', lat: 59.916, lon: 29.766 },
        { name: 'Losino-Petrovsky', lat: 55.866, lon: 38.2 },
        { name: 'Luga', lat: 58.733, lon: 29.85 },
        { name: 'Lukhovitsy', lat: 54.966, lon: 39.033 },
        { name: 'Lukoyanov', lat: 55.033, lon: 44.5 },
        { name: 'Luza', lat: 60.616, lon: 47.283 },
        { name: 'Lyantor', lat: 61.616, lon: 72.166 },
        { name: 'Lyskovo', lat: 56.033, lon: 45.033 },
        { name: 'Lysva', lat: 58.1, lon: 57.8 },
        { name: 'Lytkarino', lat: 55.583, lon: 37.9 },
        { name: 'Lyuban', lat: 59.35, lon: 31.216 },
        { name: 'Lyubertsy', lat: 55.683, lon: 37.9 },
        { name: 'Lyubim', lat: 58.35, lon: 40.683 },
        { name: 'Lyudinovo', lat: 53.866, lon: 34.433 },
        { name: 'Magadan', lat: 59.566, lon: 150.8 },
        { name: 'Magas', lat: 43.166, lon: 44.8 },
        { name: 'Magnitogorsk', lat: 53.383, lon: 59.033 },
        { name: 'Makarov', lat: 48.616, lon: 142.783 },
        { name: 'Makaryev', lat: 57.883, lon: 43.8 },
        { name: 'Makhachkala', lat: 42.983, lon: 47.5 },
        { name: 'Makushino', lat: 55.2, lon: 67.25 },
        { name: 'Malaya Vishera', lat: 58.85, lon: 32.216 },
        { name: 'Malgobek', lat: 43.516, lon: 44.583 },
        { name: 'Malmyzh', lat: 56.516, lon: 50.666 },
        { name: 'Maloarkhangelsk', lat: 52.4, lon: 36.5 },
        { name: 'Maloyaroslavets', lat: 55.0, lon: 36.466 },
        { name: 'Mamadysh', lat: 55.7, lon: 51.4 },
        { name: 'Mamonovo', lat: 54.466, lon: 19.933 },
        { name: 'Manturovo', lat: 58.333, lon: 44.766 },
        { name: 'Mariinsk', lat: 56.216, lon: 87.75 },
        { name: 'Mariinsky Posad', lat: 56.116, lon: 47.716 },
        { name: 'Marks', lat: 51.7, lon: 46.75 },
        { name: 'Maykop', lat: 44.6, lon: 40.083 },
        { name: 'Mayma', lat: 52.0, lon: 85.9 },
        { name: 'Maysky', lat: 43.633, lon: 44.066 },
        { name: 'Mednogorsk', lat: 51.416, lon: 57.583 },
        { name: 'Medvezhyegorsk', lat: 62.916, lon: 34.466 },
        { name: 'Medyn', lat: 54.966, lon: 35.866 },
        { name: 'Megion', lat: 61.033, lon: 76.1 },
        { name: 'Melenki', lat: 55.333, lon: 41.633 },
        { name: 'Meleuz', lat: 52.95, lon: 55.933 },
        { name: 'Mendeleyevsk', lat: 55.9, lon: 52.316 },
        { name: 'Menzelinsk', lat: 55.716, lon: 53.1 },
        { name: 'Meshchovsk', lat: 54.316, lon: 35.283 },
        { name: 'Mezen', lat: 65.85, lon: 44.233 },
        { name: 'Mezhdurechensk', lat: 53.683, lon: 88.05 },
        { name: 'Mezhgorye', lat: 54.05, lon: 57.816 },
        { name: 'Mglin', lat: 53.066, lon: 32.85 },
        { name: 'Miass', lat: 55.0, lon: 60.1 },
        { name: 'Michurinsk', lat: 52.9, lon: 40.5 },
        { name: 'Mikhaylov', lat: 54.233, lon: 39.033 },
        { name: 'Mikhaylovka', lat: 50.066, lon: 43.233 },
        { name: 'Mikhaylovsk', lat: 56.433, lon: 59.116 },
        { name: 'Mikun', lat: 62.35, lon: 50.066 },
        { name: 'Millerovo', lat: 48.916, lon: 40.4 },
        { name: 'Mineralnyye Vody', lat: 44.2, lon: 43.133 },
        { name: 'Minusinsk', lat: 53.716, lon: 91.683 },
        { name: 'Minyar', lat: 55.066, lon: 57.55 },
        { name: 'Mirny', lat: 62.533, lon: 113.95 },
        { name: 'Mogocha', lat: 53.733, lon: 119.766 },
        { name: 'Monchegorsk', lat: 67.933, lon: 32.916 },
        { name: 'Morozovsk', lat: 48.35, lon: 41.816 },
        { name: 'Morshansk', lat: 53.45, lon: 41.8 },
        { name: 'Mosalsk', lat: 54.483, lon: 34.983 },
        { name: 'Moskovsky', lat: 55.6, lon: 37.35 },
        { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
        { name: 'Mozdok', lat: 43.75, lon: 44.65 },
        { name: 'Mozhaysk', lat: 55.5, lon: 36.033 },
        { name: 'Mozhga', lat: 56.45, lon: 52.216 },
        { name: 'Mtsensk', lat: 53.283, lon: 36.566 },
        { name: 'Murashi', lat: 59.4, lon: 48.966 },
        { name: 'Murmansk', lat: 68.966, lon: 33.083 },
        { name: 'Murom', lat: 55.583, lon: 42.033 },
        { name: 'Myshkin', lat: 57.783, lon: 38.45 },
        { name: 'Myski', lat: 53.7, lon: 87.8 },
        { name: 'Mytishchi', lat: 55.916, lon: 37.733 },
        { name: 'Naberezhnyye Chelny', lat: 55.7, lon: 52.316 },
        { name: 'Nadym', lat: 65.533, lon: 72.516 },
        { name: 'Nakhodka', lat: 42.816, lon: 132.883 },
        { name: 'Nalchik', lat: 43.483, lon: 43.616 },
        { name: 'Narimanov', lat: 46.683, lon: 47.85 },
        { name: 'Naro-Fominsk', lat: 55.383, lon: 36.733 },
        { name: 'Nartkala', lat: 43.55, lon: 43.85 },
        { name: 'Naryan-Mar', lat: 67.633, lon: 53.016 },
        { name: 'Navashino', lat: 55.533, lon: 42.2 },
        { name: 'Navoloki', lat: 57.466, lon: 41.966 },
        { name: 'Nazarovo', lat: 56.016, lon: 90.416 },
        { name: 'Nazran', lat: 43.216, lon: 44.766 },
        { name: 'Nazyvayevsk', lat: 55.566, lon: 71.35 },
        { name: 'Neftegorsk', lat: 52.8, lon: 51.166 },
        { name: 'Neftekamsk', lat: 56.083, lon: 54.266 },
        { name: 'Neftekumsk', lat: 44.75, lon: 44.983 },
        { name: 'Nefteyugansk', lat: 61.083, lon: 72.6 },
        { name: 'Neiva', lat: 57.483, lon: 60.2 },
        { name: 'Nelidovo', lat: 56.216, lon: 32.783 },
        { name: 'Neman', lat: 55.033, lon: 22.033 },
        { name: 'Nerchinsk', lat: 51.983, lon: 116.583 },
        { name: 'Nerekhta', lat: 57.45, lon: 40.583 },
        { name: 'Neryungri', lat: 56.666, lon: 124.716 },
        { name: 'Nesterov', lat: 54.633, lon: 22.566 },
        { name: 'Nevel', lat: 56.016, lon: 29.933 },
        { name: 'Nevelsk', lat: 46.683, lon: 141.866 },
        { name: 'Nevinnomyssk', lat: 44.633, lon: 41.933 },
        { name: 'Nevyansk', lat: 57.483, lon: 60.2 },
        { name: 'Neya', lat: 58.283, lon: 43.866 },
        { name: 'Nikolayevsk', lat: 50.016, lon: 45.45 },
        { name: 'Nikolayevsk-na-Amure', lat: 53.15, lon: 140.733 },
        { name: 'Nikolsk', lat: 53.716, lon: 46.066 },
        { name: 'Nikolskoye', lat: 59.7, lon: 30.783 },
        { name: 'Nizhnekamsk', lat: 55.633, lon: 51.816 },
        { name: 'Nizhneudinsk', lat: 54.9, lon: 99.016 },
        { name: 'Nizhnevartovsk', lat: 60.933, lon: 76.583 },
        { name: 'Nizhniy Lomov', lat: 53.533, lon: 43.666 },
        { name: 'Nizhniy Novgorod', lat: 56.333, lon: 44.0 },
        { name: 'Nizhniy Tagil', lat: 57.916, lon: 59.966 },
        { name: 'Nizhnyaya Salda', lat: 58.083, lon: 60.716 },
        { name: 'Nizhnyaya Tura', lat: 58.616, lon: 59.833 },
        { name: 'Noginsk', lat: 55.85, lon: 38.45 },
        { name: 'Nolinsk', lat: 57.316, lon: 49.933 },
        { name: 'Norilsk', lat: 69.333, lon: 88.216 },
        { name: 'Novaya Ladoga', lat: 60.1, lon: 32.3 },
        { name: 'Novaya Lyalya', lat: 59.05, lon: 60.6 },
        { name: 'Novoaleksandrovsk', lat: 45.5, lon: 41.216 },
        { name: 'Novoaltaysk', lat: 53.4, lon: 83.933 },
        { name: 'Novoanninsky', lat: 50.516, lon: 42.666 },
        { name: 'Novocheboksarsk', lat: 56.116, lon: 47.483 },
        { name: 'Novocherkassk', lat: 47.416, lon: 40.083 },
        { name: 'Novodvinsk', lat: 64.416, lon: 40.816 },
        { name: 'Novokhopyorsk', lat: 51.1, lon: 41.616 },
        { name: 'Novokubansk', lat: 45.1, lon: 41.05 },
        { name: 'Novokuybyshevsk', lat: 53.1, lon: 49.916 },
        { name: 'Novokuznetsk', lat: 53.75, lon: 87.116 },
        { name: 'Novomichurinsk', lat: 54.033, lon: 39.75 },
        { name: 'Novomoskovsk', lat: 54.083, lon: 38.216 },
        { name: 'Novopavlovsk', lat: 43.966, lon: 43.633 },
        { name: 'Novorossiysk', lat: 44.716, lon: 37.766 },
        { name: 'Novorzhev', lat: 57.033, lon: 29.333 },
        { name: 'Novoshakhtinsk', lat: 47.766, lon: 39.916 },
        { name: 'Novosibirsk', lat: 55.033, lon: 82.916 },
        { name: 'Novosil', lat: 52.966, lon: 37.05 },
        { name: 'Novosokolniki', lat: 56.35, lon: 30.15 },
        { name: 'Novotroitsk', lat: 51.2, lon: 58.316 },
        { name: 'Novoulyanovsk', lat: 54.15, lon: 48.383 },
        { name: 'Novouralsk', lat: 57.25, lon: 60.083 },
        { name: 'Novouzensk', lat: 50.45, lon: 48.133 },
        { name: 'Novovoronezh', lat: 51.316, lon: 39.216 },
        { name: 'Novozybkov', lat: 52.533, lon: 31.933 },
        { name: 'Novy Oskol', lat: 50.766, lon: 37.866 },
        { name: 'Novy Urengoy', lat: 66.083, lon: 76.683 },
        { name: 'Noyabrsk', lat: 63.2, lon: 75.45 },
        { name: 'Nurlat', lat: 54.433, lon: 50.8 },
        { name: 'Nytva', lat: 57.933, lon: 55.333 },
        { name: 'Nyurba', lat: 63.283, lon: 118.333 },
        { name: 'Ob', lat: 55.0, lon: 82.7 },
        { name: 'Obluchye', lat: 49.0, lon: 131.083 },
        { name: 'Obninsk', lat: 55.1, lon: 36.616 },
        { name: 'Oboyan', lat: 51.2, lon: 36.266 },
        { name: 'Ochakovo-Matveyevskoye', lat: 55.683, lon: 37.45 },
        { name: 'Ocher', lat: 57.883, lon: 54.716 },
        { name: 'Odintsovo', lat: 55.666, lon: 37.266 },
        { name: 'Okha', lat: 53.583, lon: 142.95 },
        { name: 'Okhansk', lat: 57.716, lon: 55.383 },
        { name: 'Oktyabrsk', lat: 53.166, lon: 48.666 },
        { name: 'Oktyabrsky', lat: 54.466, lon: 53.466 },
        { name: 'Okulovka', lat: 58.4, lon: 33.3 },
        { name: 'Olenegorsk', lat: 68.15, lon: 33.3 },
        { name: 'Olonets', lat: 60.983, lon: 32.966 },
        { name: 'Olyokminsk', lat: 60.383, lon: 120.416 },
        { name: 'Omsk', lat: 54.983, lon: 73.366 },
        { name: 'Omutninsk', lat: 58.666, lon: 52.183 },
        { name: 'Onega', lat: 63.916, lon: 38.083 },
        { name: 'Opochka', lat: 56.716, lon: 28.666 },
        { name: 'Orekhovo-Zuyevo', lat: 55.8, lon: 38.966 },
        { name: 'Oryol', lat: 52.966, lon: 36.083 },
        { name: 'Orenburg', lat: 51.766, lon: 55.1 },
        { name: 'Orlov', lat: 58.533, lon: 48.883 },
        { name: 'Orsk', lat: 51.2, lon: 58.566 },
        { name: 'Osa', lat: 57.283, lon: 55.45 },
        { name: 'Osinniki', lat: 53.616, lon: 87.333 },
        { name: 'Ostashkov', lat: 57.15, lon: 33.1 },
        { name: 'Ostrogozhsk', lat: 50.866, lon: 39.066 },
        { name: 'Ostrov', lat: 57.333, lon: 28.35 },
        { name: 'Ostrovnoy', lat: 68.05, lon: 39.5 },
        { name: 'Otradnoye', lat: 59.766, lon: 30.8 },
        { name: 'Otradny', lat: 53.366, lon: 51.35 },
        { name: 'Ozyorsk', lat: 54.4, lon: 22.016 },
        { name: 'Ozyory', lat: 54.85, lon: 38.55 },
        { name: 'Pallasovka', lat: 50.05, lon: 46.883 },
        { name: 'Partizansk', lat: 43.133, lon: 133.133 },
        { name: 'Pavlovo', lat: 55.966, lon: 43.066 },
        { name: 'Pavlovsk', lat: 50.45, lon: 40.1 },
        { name: 'Pavlovsky Posad', lat: 55.783, lon: 38.65 },
        { name: 'Pechora', lat: 65.15, lon: 57.216 },
        { name: 'Pechory', lat: 57.816, lon: 27.616 },
        { name: 'Penza', lat: 53.2, lon: 45.0 },
        { name: 'Pereslavl-Zalessky', lat: 56.733, lon: 38.85 },
        { name: 'Peresvet', lat: 56.416, lon: 38.183 },
        { name: 'Perevoz', lat: 55.6, lon: 44.55 },
        { name: 'Perm', lat: 58.0, lon: 56.316 },
        { name: 'Pervomaysk', lat: 54.866, lon: 43.8 },
        { name: 'Pervouralsk', lat: 56.916, lon: 59.95 },
        { name: 'Pestovo', lat: 58.6, lon: 35.8 },
        { name: 'Petergof', lat: 59.883, lon: 29.9 },
        { name: 'Petropavlovsk-Kamchatsky', lat: 53.016, lon: 158.65 },
        { name: 'Petrov Val', lat: 50.133, lon: 45.2 },
        { name: 'Petrovsk', lat: 52.316, lon: 45.4 },
        { name: 'Petrovsk-Zabaykalsky', lat: 51.283, lon: 108.833 },
        { name: 'Petrozavodsk', lat: 61.783, lon: 34.35 },
        { name: 'Petukhovo', lat: 55.066, lon: 67.9 },
        { name: 'Petushki', lat: 55.933, lon: 39.466 },
        { name: 'Pevek', lat: 69.7, lon: 170.283 },
        { name: 'Pikalyovo', lat: 59.516, lon: 34.166 },
        { name: 'Pionersky', lat: 54.95, lon: 20.233 },
        { name: 'Pitkyaranta', lat: 61.566, lon: 31.483 },
        { name: 'Plast', lat: 54.366, lon: 60.816 },
        { name: 'Plavsk', lat: 53.7, lon: 37.3 },
        { name: 'Plyos', lat: 57.466, lon: 41.516 },
        { name: 'Pochep', lat: 52.933, lon: 33.45 },
        { name: 'Pochinok', lat: 54.4, lon: 32.45 },
        { name: 'Podolsk', lat: 55.416, lon: 37.55 },
        { name: 'Podporozhye', lat: 60.916, lon: 34.166 },
        { name: 'Pokachi', lat: 61.75, lon: 75.583 },
        { name: 'Pokhvistnevo', lat: 53.65, lon: 52.133 },
        { name: 'Pokrov', lat: 55.916, lon: 39.183 },
        { name: 'Pokrovsk', lat: 61.483, lon: 129.133 },
        { name: 'Polessk', lat: 54.866, lon: 21.1 },
        { name: 'Polevskoy', lat: 56.45, lon: 60.183 },
        { name: 'Poltavka', lat: 54.366, lon: 71.766 },
        { name: 'Polyarny', lat: 69.2, lon: 33.45 },
        { name: 'Polyarnyye Zori', lat: 67.366, lon: 32.5 },
        { name: 'Polysayevo', lat: 54.6, lon: 86.283 },
        { name: 'Porkhov', lat: 57.766, lon: 29.55 },
        { name: 'Poronaysk', lat: 49.216, lon: 143.1 },
        { name: 'Poshekhonye', lat: 58.5, lon: 39.133 },
        { name: 'Povorino', lat: 51.2, lon: 42.25 },
        { name: 'Pravdinsk', lat: 54.5, lon: 21.016 },
        { name: 'Primorsk', lat: 60.366, lon: 28.616 },
        { name: 'Primorsko-Akhtarsk', lat: 46.033, lon: 38.166 },
        { name: 'Priozersk', lat: 61.033, lon: 30.133 },
        { name: 'Privolzhsk', lat: 57.383, lon: 41.283 },
        { name: 'Prokhladny', lat: 43.75, lon: 44.033 },
        { name: 'Prokopyevsk', lat: 53.883, lon: 86.716 },
        { name: 'Proletarsk', lat: 46.7, lon: 41.716 },
        { name: 'Protvino', lat: 54.866, lon: 37.216 },
        { name: 'Pskov', lat: 57.816, lon: 28.333 },
        { name: 'Puchezh', lat: 56.983, lon: 43.166 },
        { name: 'Pudozh', lat: 61.8, lon: 36.533 },
        { name: 'Pugachyov', lat: 52.016, lon: 48.8 },
        { name: 'Pushchino', lat: 54.833, lon: 37.616 },
        { name: 'Pushkin', lat: 59.716, lon: 30.416 },
        { name: 'Pushkino', lat: 56.016, lon: 37.85 },
        { name: 'Pustoshka', lat: 56.333, lon: 29.366 },
        { name: 'Pyatigorsk', lat: 44.05, lon: 43.066 },
        { name: 'Pytalovo', lat: 57.066, lon: 27.916 },
        { name: 'Pyt-Yakh', lat: 60.75, lon: 72.783 },
        { name: 'Raduzhny', lat: 62.1, lon: 77.466 },
        { name: 'Ramenskoye', lat: 55.566, lon: 38.233 },
        { name: 'Rasskazovo', lat: 52.666, lon: 41.883 },
        { name: 'Raychikhinsk', lat: 49.766, lon: 129.416 },
        { name: 'Reutov', lat: 55.766, lon: 37.866 },
        { name: 'Revda', lat: 56.8, lon: 59.916 },
        { name: 'Rezh', lat: 57.366, lon: 61.4 },
        { name: 'Rodniki', lat: 57.1, lon: 41.733 },
        { name: 'Roshal', lat: 55.666, lon: 39.866 },
        { name: 'Roslavl', lat: 53.95, lon: 32.866 },
        { name: 'Rossosh', lat: 50.2, lon: 39.583 },
        { name: 'Rostov', lat: 57.183, lon: 39.416 },
        { name: 'Rostov-on-Don', lat: 47.233, lon: 39.7 },
        { name: 'Rtishchevo', lat: 52.25, lon: 43.783 },
        { name: 'Rubtsovsk', lat: 51.516, lon: 81.216 },
        { name: 'Rudnya', lat: 54.95, lon: 31.1 },
        { name: 'Ruza', lat: 55.7, lon: 36.2 },
        { name: 'Ruzayevka', lat: 54.066, lon: 44.95 },
        { name: 'Ryazan', lat: 54.616, lon: 39.716 },
        { name: 'Ryazhsk', lat: 53.7, lon: 40.066 },
        { name: 'Rybinsk', lat: 58.05, lon: 38.833 },
        { name: 'Rybnoye', lat: 54.733, lon: 39.516 },
        { name: 'Rylsk', lat: 51.566, lon: 34.683 },
        { name: 'Rzhev', lat: 56.266, lon: 34.333 },
        { name: 'Safonovo', lat: 55.1, lon: 33.25 },
        { name: 'Saint Petersburg', lat: 59.9343, lon: 30.3351 },
        { name: 'Salair', lat: 54.233, lon: 85.8 },
        { name: 'Salavat', lat: 53.366, lon: 55.916 },
        { name: 'Salekhard', lat: 66.533, lon: 66.6 },
        { name: 'Salsk', lat: 46.466, lon: 41.533 },
        { name: 'Samara', lat: 53.2, lon: 50.15 },
        { name: 'Saransk', lat: 54.183, lon: 45.183 },
        { name: 'Sarapul', lat: 56.466, lon: 53.8 },
        { name: 'Saratov', lat: 51.533, lon: 46.016 },
        { name: 'Sarov', lat: 54.933, lon: 43.316 },
        { name: 'Sasovo', lat: 54.35, lon: 41.916 },
        { name: 'Satka', lat: 55.05, lon: 59.033 },
        { name: 'Sayanogorsk', lat: 53.083, lon: 91.4 },
        { name: 'Sayansk', lat: 54.116, lon: 102.166 },
        { name: 'Sebezh', lat: 56.283, lon: 28.483 },
        { name: 'Segezha', lat: 63.733, lon: 34.316 },
        { name: 'Seltso', lat: 53.366, lon: 34.1 },
        { name: 'Semikarakorsk', lat: 47.516, lon: 40.8 },
        { name: 'Semiluki', lat: 51.683, lon: 39.033 },
        { name: 'Sengiley', lat: 53.966, lon: 48.8 },
        { name: 'Serafimovich', lat: 49.583, lon: 42.733 },
        { name: 'Serdobsk', lat: 52.466, lon: 44.216 },
        { name: 'Sergach', lat: 55.533, lon: 45.466 },
        { name: 'Sergiyev Posad', lat: 56.3, lon: 38.133 },
        { name: 'Serov', lat: 59.6, lon: 60.583 },
        { name: 'Serpukhov', lat: 54.916, lon: 37.4 },
        { name: 'Sertolovo', lat: 60.15, lon: 30.2 },
        { name: 'Sestroretsk', lat: 60.1, lon: 29.966 },
        { name: 'Severobaykalsk', lat: 55.65, lon: 109.316 },
        { name: 'Severodvinsk', lat: 64.566, lon: 39.833 },
        { name: 'Severo-Kurilsk', lat: 50.683, lon: 156.116 },
        { name: 'Severomorsk', lat: 69.066, lon: 33.416 },
        { name: 'Severouralsk', lat: 60.15, lon: 59.95 },
        { name: 'Seversk', lat: 56.6, lon: 84.85 },
        { name: 'Sevsk', lat: 52.15, lon: 34.5 },
        { name: 'Shadrinsk', lat: 56.083, lon: 63.633 },
        { name: 'Shagonar', lat: 51.533, lon: 92.9 },
        { name: 'Shakhty', lat: 47.7, lon: 40.2 },
        { name: 'Shakhunya', lat: 57.666, lon: 46.6 },
        { name: 'Shali', lat: 43.15, lon: 45.9 },
        { name: 'Sharya', lat: 58.366, lon: 45.516 },
        { name: 'Sharypovo', lat: 55.533, lon: 89.2 },
        { name: 'Shatsk', lat: 54.033, lon: 41.7 },
        { name: 'Shatura', lat: 55.583, lon: 39.533 },
        { name: 'Shcherbinka', lat: 55.5, lon: 37.566 },
        { name: 'Shchigry', lat: 51.866, lon: 36.916 },
        { name: 'Shchyokino', lat: 54.0, lon: 37.516 },
        { name: 'Shchyolkovo', lat: 55.916, lon: 38.0 },
        { name: 'Shebekino', lat: 50.4, lon: 36.9 },
        { name: 'Shelekhov', lat: 52.2, lon: 104.1 },
        { name: 'Shenkursk', lat: 62.1, lon: 42.9 },
        { name: 'Shikhany', lat: 52.116, lon: 47.2 },
        { name: 'Shilka', lat: 51.85, lon: 116.033 },
        { name: 'Shimanovsk', lat: 52.0, lon: 127.666 },
        { name: 'Shlisselburg', lat: 59.95, lon: 31.033 },
        { name: 'Shumerlya', lat: 55.5, lon: 46.416 },
        { name: 'Shumikha', lat: 55.233, lon: 63.283 },
        { name: 'Shuya', lat: 56.85, lon: 41.366 },
        { name: 'Sibay', lat: 52.7, lon: 58.666 },
        { name: 'Sim', lat: 54.983, lon: 57.683 },
        { name: 'Skopin', lat: 53.816, lon: 39.55 },
        { name: 'Skovorodino', lat: 53.983, lon: 123.933 },
        { name: 'Slantsy', lat: 59.116, lon: 28.083 },
        { name: 'Slavgorod', lat: 52.966, lon: 78.65 },
        { name: 'Slavsk', lat: 55.05, lon: 21.666 },
        { name: 'Slavyansk-na-Kubani', lat: 45.25, lon: 38.116 },
        { name: 'Slobodskoy', lat: 58.733, lon: 50.166 },
        { name: 'Slyudyanka', lat: 51.666, lon: 103.7 },
        { name: 'Smolensk', lat: 54.783, lon: 32.05 },
        { name: 'Snezhinsk', lat: 56.083, lon: 60.733 },
        { name: 'Snezhnogorsk', lat: 69.2, lon: 33.233 },
        { name: 'Sobinka', lat: 55.983, lon: 40.016 },
        { name: 'Sochi', lat: 43.6, lon: 39.733 },
        { name: 'Sokol', lat: 59.466, lon: 40.116 },
        { name: 'Sokolniki', lat: 54.0, lon: 38.466 },
        { name: 'Sol-Iletsk', lat: 51.166, lon: 54.983 },
        { name: 'Soligalich', lat: 59.083, lon: 42.283 },
        { name: 'Solikamsk', lat: 59.666, lon: 56.766 },
        { name: 'Solnechnogorsk', lat: 56.183, lon: 36.983 },
        { name: 'Soltsy', lat: 58.116, lon: 30.316 },
        { name: 'Solvychegodsk', lat: 61.333, lon: 46.916 },
        { name: 'Sorochinsk', lat: 52.433, lon: 53.15 },
        { name: 'Sorsk', lat: 54.0, lon: 90.25 },
        { name: 'Sortavala', lat: 61.7, lon: 30.666 },
        { name: 'Sosensky', lat: 54.066, lon: 35.966 },
        { name: 'Sosnogorsk', lat: 63.6, lon: 53.883 },
        { name: 'Sosnovka', lat: 56.25, lon: 51.266 },
        { name: 'Sosnovoborsk', lat: 56.133, lon: 93.366 },
        { name: 'Sosnovy Bor', lat: 59.9, lon: 29.083 },
        { name: 'Sovetsk', lat: 55.083, lon: 21.883 },
        { name: 'Sovetskaya Gavan', lat: 48.966, lon: 140.283 },
        { name: 'Sovetsky', lat: 61.366, lon: 63.583 },
        { name: 'Spas-Demensk', lat: 54.416, lon: 34.016 },
        { name: 'Spas-Klepiki', lat: 55.133, lon: 40.166 },
        { name: 'Spassk', lat: 53.933, lon: 43.183 },
        { name: 'Spassk-Dalny', lat: 44.6, lon: 132.816 },
        { name: 'Spassk-Ryazansky', lat: 54.4, lon: 40.383 },
        { name: 'Srednekolymsk', lat: 67.45, lon: 153.7 },
        { name: 'Sredneuralsk', lat: 56.983, lon: 60.466 },
        { name: 'Sretensk', lat: 52.233, lon: 117.7 },
        { name: 'Staraya Kupavna', lat: 55.8, lon: 38.183 },
        { name: 'Staraya Russa', lat: 57.983, lon: 31.35 },
        { name: 'Staritsa', lat: 56.516, lon: 34.933 },
        { name: 'Starodub', lat: 52.583, lon: 32.766 },
        { name: 'Stary Oskol', lat: 51.3, lon: 37.833 },
        { name: 'Stavropol', lat: 45.05, lon: 41.983 },
        { name: 'Sterlitamak', lat: 53.633, lon: 55.95 },
        { name: 'Strezhevoy', lat: 60.733, lon: 77.583 },
        { name: 'Stroitel', lat: 50.783, lon: 36.483 },
        { name: 'Strunino', lat: 56.383, lon: 38.583 },
        { name: 'Stupino', lat: 54.9, lon: 38.066 },
        { name: 'Sudogda', lat: 55.95, lon: 40.866 },
        { name: 'Sudzha', lat: 51.2, lon: 35.266 },
        { name: 'Sukhinichi', lat: 54.1, lon: 35.333 },
        { name: 'Sukhoi Log', lat: 56.916, lon: 62.033 },
        { name: 'Suoyarvi', lat: 62.083, lon: 32.35 },
        { name: 'Surazh', lat: 53.016, lon: 32.4 },
        { name: 'Surgut', lat: 61.25, lon: 73.416 },
        { name: 'Surovikino', lat: 48.6, lon: 42.85 },
        { name: 'Sursk', lat: 53.083, lon: 45.7 },
        { name: 'Susuman', lat: 62.783, lon: 148.166 },
        { name: 'Suvorov', lat: 54.116, lon: 36.5 },
        { name: 'Suzdal', lat: 56.416, lon: 40.45 },
        { name: 'Svetlogorsk', lat: 54.95, lon: 20.15 },
        { name: 'Svetlograd', lat: 45.333, lon: 42.85 },
        { name: 'Svetly', lat: 54.683, lon: 20.133 },
        { name: 'Svetogorsk', lat: 61.116, lon: 28.85 },
        { name: 'Svirsk', lat: 53.083, lon: 103.333 },
        { name: 'Svobodny', lat: 51.383, lon: 128.133 },
        { name: 'Syasstroy', lat: 60.133, lon: 32.566 },
        { name: 'Syktyvkar', lat: 61.666, lon: 50.816 },
        { name: 'Sysert', lat: 56.5, lon: 60.816 },
        { name: 'Syzran', lat: 53.166, lon: 48.466 },
        { name: 'Taganrog', lat: 47.233, lon: 38.9 },
        { name: 'Taldom', lat: 56.733, lon: 37.533 },
        { name: 'Talitsa', lat: 57.016, lon: 63.733 },
        { name: 'Tambov', lat: 52.733, lon: 41.433 },
        { name: 'Tara', lat: 56.9, lon: 74.366 },
        { name: 'Tarko-Sale', lat: 64.916, lon: 77.766 },
        { name: 'Tarusa', lat: 54.716, lon: 37.183 },
        { name: 'Tashtagol', lat: 52.766, lon: 87.883 },
        { name: 'Tatarsk', lat: 55.216, lon: 75.966 },
        { name: 'Tavda', lat: 58.05, lon: 65.266 },
        { name: 'Tayga', lat: 56.066, lon: 85.616 },
        { name: 'Tayshet', lat: 55.933, lon: 98.016 },
        { name: 'Teberda', lat: 43.45, lon: 41.75 },
        { name: 'Temnikov', lat: 54.633, lon: 43.216 },
        { name: 'Temryuk', lat: 45.266, lon: 37.383 },
        { name: 'Terek', lat: 43.483, lon: 44.133 },
        { name: 'Tetyushi', lat: 54.933, lon: 48.833 },
        { name: 'Teykovo', lat: 56.85, lon: 40.533 },
        { name: 'Tikhoretsk', lat: 45.85, lon: 40.116 },
        { name: 'Tikhvin', lat: 59.633, lon: 33.5 },
        { name: 'Timashyovsk', lat: 45.616, lon: 38.933 },
        { name: 'Tobolsk', lat: 58.2, lon: 68.266 },
        { name: 'Toguchin', lat: 55.233, lon: 84.383 },
        { name: 'Tolyatti', lat: 53.516, lon: 49.416 },
        { name: 'Tomari', lat: 47.766, lon: 142.066 },
        { name: 'Tommot', lat: 58.966, lon: 126.266 },
        { name: 'Tomsk', lat: 56.5, lon: 84.966 },
        { name: 'Topki', lat: 55.283, lon: 85.616 },
        { name: 'Toropets', lat: 56.5, lon: 31.633 },
        { name: 'Torzhok', lat: 57.033, lon: 34.966 },
        { name: 'Tosno', lat: 59.55, lon: 30.883 },
        { name: 'Totma', lat: 59.966, lon: 42.75 },
        { name: 'Troitsk', lat: 54.1, lon: 61.566 },
        { name: 'Trubchevsk', lat: 52.583, lon: 33.766 },
        { name: 'Tryokhgorny', lat: 54.8, lon: 58.45 },
        { name: 'Tsimlyansk', lat: 47.65, lon: 42.1 },
        { name: 'Tsivilsk', lat: 55.866, lon: 47.466 },
        { name: 'Tuapse', lat: 44.1, lon: 39.083 },
        { name: 'Tula', lat: 54.2, lon: 37.616 },
        { name: 'Tulun', lat: 54.566, lon: 100.566 },
        { name: 'Turan', lat: 52.15, lon: 93.916 },
        { name: 'Turinsk', lat: 58.033, lon: 63.7 },
        { name: 'Tutayev', lat: 57.883, lon: 39.533 },
        { name: 'Tuymazy', lat: 54.6, lon: 53.7 },
        { name: 'Tver', lat: 56.866, lon: 35.916 },
        { name: 'Tynda', lat: 55.15, lon: 124.716 },
        { name: 'Tyrnyauz', lat: 43.4, lon: 42.916 },
        { name: 'Tyukalinsk', lat: 55.866, lon: 72.2 },
        { name: 'Tyumen', lat: 57.15, lon: 65.533 },
        { name: 'Uchaly', lat: 54.366, lon: 59.45 },
        { name: 'Udachny', lat: 66.4, lon: 112.316 },
        { name: 'Udomlya', lat: 57.883, lon: 35.016 },
        { name: 'Ufa', lat: 54.733, lon: 55.966 },
        { name: 'Uglegorsk', lat: 49.083, lon: 142.033 },
        { name: 'Uglich', lat: 57.533, lon: 38.333 },
        { name: 'Ukhta', lat: 63.566, lon: 53.7 },
        { name: 'Ulan-Ude', lat: 51.833, lon: 107.616 },
        { name: 'Ulyanovsk', lat: 54.316, lon: 48.366 },
        { name: 'Unecha', lat: 52.85, lon: 32.683 },
        { name: 'Uray', lat: 60.133, lon: 64.783 },
        { name: 'Uren', lat: 57.466, lon: 45.783 },
        { name: 'Urus-Martan', lat: 43.133, lon: 45.55 },
        { name: 'Uryupinsk', lat: 50.8, lon: 42.016 },
        { name: 'Urzhum', lat: 57.116, lon: 50.0 },
        { name: 'Usinsk', lat: 66.0, lon: 57.533 },
        { name: 'Usman', lat: 52.05, lon: 39.733 },
        { name: 'Usolye', lat: 59.416, lon: 56.683 },
        { name: 'Usolye-Sibirskoye', lat: 52.75, lon: 103.633 },
        { name: 'Ussuriysk', lat: 43.8, lon: 131.966 },
        { name: 'Ust-Dzheguta', lat: 44.083, lon: 41.966 },
        { name: 'Ust-Ilimsk', lat: 58.0, lon: 102.666 },
        { name: 'Ust-Katav', lat: 54.933, lon: 58.166 },
        { name: 'Ust-Kut', lat: 56.8, lon: 105.766 },
        { name: 'Ust-Labinsk', lat: 45.216, lon: 39.683 },
        { name: 'Ustyuzhna', lat: 58.833, lon: 36.433 },
        { name: 'Uvarovo', lat: 51.983, lon: 42.266 },
        { name: 'Uyar', lat: 55.816, lon: 94.316 },
        { name: 'Uzhur', lat: 55.316, lon: 89.816 },
        { name: 'Uzlovaya', lat: 53.983, lon: 38.166 },
        { name: 'Valday', lat: 57.983, lon: 33.25 },
        { name: 'Valuyki', lat: 50.183, lon: 38.1 },
        { name: 'Velikiye Luki', lat: 56.333, lon: 30.533 },
        { name: 'Veliky Novgorod', lat: 58.516, lon: 31.283 },
        { name: 'Veliky Ustyug', lat: 60.766, lon: 46.3 },
        { name: 'Velsk', lat: 61.066, lon: 42.1 },
        { name: 'Venyov', lat: 54.35, lon: 38.266 },
        { name: 'Vereshchagino', lat: 58.083, lon: 54.65 },
        { name: 'Vereya', lat: 55.35, lon: 36.2 },
        { name: 'Verkhneuralsk', lat: 53.883, lon: 59.216 },
        { name: 'Verkhny Tagil', lat: 57.383, lon: 59.933 },
        { name: 'Verkhny Ufaley', lat: 56.066, lon: 60.233 },
        { name: 'Verkhnyaya Pyshma', lat: 56.966, lon: 60.583 },
        { name: 'Verkhnyaya Salda', lat: 58.05, lon: 60.55 },
        { name: 'Verkhnyaya Tura', lat: 58.366, lon: 59.8 },
        { name: 'Verkhoturye', lat: 58.866, lon: 60.8 },
        { name: 'Verkhoyansk', lat: 67.55, lon: 133.383 },
        { name: 'Vesyegonsk', lat: 58.65, lon: 37.266 },
        { name: 'Vetluga', lat: 57.85, lon: 45.766 },
        { name: 'Vichuga', lat: 57.216, lon: 41.916 },
        { name: 'Vidnoye', lat: 55.55, lon: 37.716 },
        { name: 'Vikhorevka', lat: 56.116, lon: 101.166 },
        { name: 'Vilyuchinsk', lat: 52.933, lon: 158.4 },
        { name: 'Vilyuysk', lat: 63.75, lon: 121.633 },
        { name: 'Vladikavkaz', lat: 43.016, lon: 44.666 },
        { name: 'Vladimir', lat: 56.133, lon: 40.416 },
        { name: 'Vladivostok', lat: 43.116, lon: 131.9 },
        { name: 'Volchansk', lat: 59.933, lon: 60.083 },
        { name: 'Volgodonsk', lat: 47.516, lon: 42.15 },
        { name: 'Volgograd', lat: 48.7, lon: 44.516 },
        { name: 'Volgorechensk', lat: 57.433, lon: 41.166 },
        { name: 'Volkhov', lat: 59.916, lon: 32.35 },
        { name: 'Volodarsk', lat: 56.233, lon: 43.2 },
        { name: 'Vologda', lat: 59.216, lon: 39.9 },
        { name: 'Volokolamsk', lat: 56.033, lon: 35.95 },
        { name: 'Volosovo', lat: 59.45, lon: 29.483 },
        { name: 'Volsk', lat: 52.033, lon: 47.383 },
        { name: 'Volzhsk', lat: 55.866, lon: 48.35 },
        { name: 'Volzhsky', lat: 48.783, lon: 44.766 },
        { name: 'Vorkuta', lat: 67.5, lon: 64.016 },
        { name: 'Voronezh', lat: 51.666, lon: 39.2 },
        { name: 'Vorsma', lat: 55.983, lon: 43.266 },
        { name: 'Voskresensk', lat: 55.316, lon: 38.683 },
        { name: 'Votkinsk', lat: 57.05, lon: 54.0 },
        { name: 'Vsevolozhsk', lat: 60.016, lon: 30.666 },
        { name: 'Vuktyl', lat: 63.866, lon: 57.316 },
        { name: 'Vyatskiye Polyany', lat: 56.216, lon: 51.066 },
        { name: 'Vyazemsky', lat: 47.533, lon: 134.75 },
        { name: 'Vyazma', lat: 55.2, lon: 34.3 },
        { name: 'Vyazniki', lat: 56.25, lon: 42.133 },
        { name: 'Vyborg', lat: 60.7, lon: 28.75 },
        { name: 'Vyksa', lat: 55.316, lon: 42.183 },
        { name: 'Vyshny Volochyok', lat: 57.583, lon: 34.566 },
        { name: 'Vysokovsk', lat: 56.316, lon: 36.55 },
        { name: 'Vysotsk', lat: 60.616, lon: 28.566 },
        { name: 'Vytegra', lat: 61.0, lon: 36.45 },
        { name: 'Yadrin', lat: 55.95, lon: 46.2 },
        { name: 'Yakhroma', lat: 56.3, lon: 37.483 },
        { name: 'Yakutsk', lat: 62.033, lon: 129.733 },
        { name: 'Yalutorovsk', lat: 56.666, lon: 66.3 },
        { name: 'Yanaul', lat: 56.266, lon: 54.933 },
        { name: 'Yaransk', lat: 57.3, lon: 47.883 },
        { name: 'Yaroslavl', lat: 57.616, lon: 39.85 },
        { name: 'Yarovoye', lat: 52.933, lon: 78.583 },
        { name: 'Yartsevo', lat: 55.066, lon: 32.683 },
        { name: 'Yasnogorsk', lat: 54.483, lon: 37.7 },
        { name: 'Yasny', lat: 51.033, lon: 59.866 },
        { name: 'Yefremov', lat: 53.15, lon: 38.116 },
        { name: 'Yegoryevsk', lat: 55.383, lon: 39.033 },
        { name: 'Yekaterinburg', lat: 56.8389, lon: 60.6057 },
        { name: 'Yelabuga', lat: 55.766, lon: 52.066 },
        { name: 'Yelets', lat: 52.616, lon: 38.5 },
        { name: 'Yelizovo', lat: 53.183, lon: 158.383 },
        { name: 'Yelnya', lat: 54.566, lon: 33.166 },
        { name: 'Yemanzhelinsk', lat: 54.75, lon: 61.316 },
        { name: 'Yemva', lat: 62.583, lon: 50.85 },
        { name: 'Yeniseysk', lat: 58.45, lon: 92.166 },
        { name: 'Yermolino', lat: 55.2, lon: 36.6 },
        { name: 'Yershov', lat: 51.35, lon: 48.283 },
        { name: 'Yesentuki', lat: 44.033, lon: 42.85 },
        { name: 'Yoshkar-Ola', lat: 56.633, lon: 47.866 },
        { name: 'Yubileyny', lat: 55.933, lon: 37.85 },
        { name: 'Yugorsk', lat: 61.316, lon: 63.333 },
        { name: 'Yukhnov', lat: 54.75, lon: 35.233 },
        { name: 'Yurga', lat: 55.716, lon: 84.9 },
        { name: 'Yuryevets', lat: 57.316, lon: 43.1 },
        { name: 'Yuryev-Polsky', lat: 56.5, lon: 39.683 },
        { name: 'Yuzha', lat: 56.583, lon: 42.016 },
        { name: 'Yuzhno-Sakhalinsk', lat: 46.95, lon: 142.733 },
        { name: 'Yuzhno-Sukhokumsk', lat: 44.666, lon: 45.65 },
        { name: 'Yuzhnouralsk', lat: 54.45, lon: 61.25 },
        { name: 'Zaigrayevo', lat: 51.833, lon: 108.266 },
        { name: 'Zainsk', lat: 55.3, lon: 52.016 },
        { name: 'Zakamensk', lat: 50.383, lon: 103.283 },
        { name: 'Zaozyorny', lat: 55.966, lon: 94.7 },
        { name: 'Zapadnaya Dvina', lat: 56.266, lon: 32.083 },
        { name: 'Zaraysk', lat: 54.766, lon: 38.883 },
        { name: 'Zarechny', lat: 53.2, lon: 45.166 },
        { name: 'Zarinsk', lat: 53.7, lon: 84.933 },
        { name: 'Zavitinsk', lat: 50.116, lon: 129.45 },
        { name: 'Zavodoukovsk', lat: 56.5, lon: 66.55 },
        { name: 'Zavolzhsk', lat: 57.483, lon: 42.133 },
        { name: 'Zavolzhye', lat: 56.633, lon: 43.383 },
        { name: 'Zelenodolsk', lat: 55.85, lon: 48.516 },
        { name: 'Zelenogorsk', lat: 56.1, lon: 94.583 },
        { name: 'Zelenograd', lat: 55.983, lon: 37.183 },
        { name: 'Zelenogradsk', lat: 54.95, lon: 20.483 },
        { name: 'Zelenokumsk', lat: 44.4, lon: 43.883 },
        { name: 'Zernograd', lat: 46.85, lon: 40.3 },
        { name: 'Zeya', lat: 53.733, lon: 127.25 },
        { name: 'Zheleznodorozhny', lat: 55.75, lon: 38.016 },
        { name: 'Zheleznogorsk', lat: 52.333, lon: 35.366 },
        { name: 'Zheleznogorsk-Ilimsky', lat: 56.583, lon: 104.116 },
        { name: 'Zheleznovodsk', lat: 44.133, lon: 43.016 },
        { name: 'Zherdevka', lat: 51.833, lon: 41.466 },
        { name: 'Zhigulyovsk', lat: 53.4, lon: 49.533 },
        { name: 'Zhirnovsk', lat: 50.983, lon: 44.766 },
        { name: 'Zhizdra', lat: 53.75, lon: 34.733 },
        { name: 'Zhukov', lat: 55.033, lon: 36.75 },
        { name: 'Zhukovka', lat: 53.533, lon: 33.733 },
        { name: 'Zhukovsky', lat: 55.6, lon: 38.116 },
        { name: 'Zima', lat: 53.916, lon: 102.05 },
        { name: 'Zlatoust', lat: 55.166, lon: 59.666 },
        { name: 'Zlynka', lat: 52.433, lon: 31.733 },
        { name: 'Zmeinogorsk', lat: 51.166, lon: 82.2 },
        { name: 'Znamensk', lat: 48.583, lon: 45.733 },
        { name: 'Zubtsov', lat: 56.166, lon: 34.583 },
        { name: 'Zuyevka', lat: 58.4, lon: 51.133 },
        { name: 'Zvenigorod', lat: 55.733, lon: 36.85 },
        { name: 'Zvenigovo', lat: 55.966, lon: 48.016 },
        { name: 'Zverevo', lat: 48.016, lon: 40.116 }
    ];
  }


  async onEnable() {
    console.log('[Weather] Plugin enabled');
    await this.loadStyles();
    
    const saved = await this.context.storage.get('settings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    
    this.context.ui.registerHeaderItem({
      label: 'Weather',
      icon: this.getWeatherIcon() || '🌤️',
      onClick: () => this.openWeatherModal()
    });
    
    if (this.settings.showInGarden) {
      this.context.ui.registerGardenWidget({
        render: (container) => this.renderGardenWidget(container),
        position: 'top'
      });
    }
    
    await this.fetchWeather();
    this.updateInterval = setInterval(() => this.fetchWeather(), 30 * 60 * 1000);
    
    this.hooks.on('onHabitComplete', (habit) => {
      console.log('[Weather] Habit completed:', habit.name);
    });
  }
  
  async loadStyles() {
    if (document.getElementById('weather-plugin-styles')) return;
    try {
      const css = await window.electron.readPluginFile('weather/styles.css');
      if (css) {
        const style = document.createElement('style');
        style.id = 'weather-plugin-styles';
        style.textContent = css;
        document.head.appendChild(style);
      }
    } catch (e) {
      console.warn('[Weather] Failed to load styles:', e);
    }
  }
  
  async onDisable() {
    console.log('[Weather] Plugin disabled');
    if (this.updateInterval) clearInterval(this.updateInterval);
    document.getElementById('weather-plugin-styles')?.remove();
  }
  

  async searchCity(query) {
    if (!query || query.length < 2) return [];
    
    const localResults = this.russianCities
      .filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      .map(c => ({
        name: c.name,
        country: 'Russia',
        lat: c.lat,
        lon: c.lon
      }));

    if (localResults.length > 0) {
      console.log('[Weather] Found in local DB:', localResults.length);
      return localResults.slice(0, 10);
    }

    console.log('[Weather] Searching via Open-Meteo API...');
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      
      return (data.results || []).map(r => ({
        name: r.name,
        country: r.country,
        admin1: r.admin1,
        lat: r.latitude,
        lon: r.longitude
      }));
    } catch (e) {
      console.error('[Weather] Search failed:', e);
      return [];
    }
  }
  
  async fetchWeather() {
    try {
      const lat = this.settings.lat || 55.7558;
      const lon = this.settings.lon || 37.6173;
      
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
      const response = await fetch(url);
      const data = await response.json();
      
      this.weatherData = {
        temp: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        units: '°C'
      };
      
      if (this.settings.units === 'fahrenheit') {
        this.weatherData.temp = Math.round(this.weatherData.temp * 9/5 + 32);
        this.weatherData.feelsLike = Math.round(this.weatherData.feelsLike * 9/5 + 32);
        this.weatherData.units = '°F';
      }
      
      console.log('[Weather] Updated:', this.weatherData);
      this.updateHeaderIcon();
      this.updateGardenWidget();
    } catch (e) {
      console.error('[Weather] Failed to fetch:', e);
    }
  }
  
  getWeatherIcon() {
    if (!this.weatherData) return '🌤️';
    const code = this.weatherData.weatherCode;
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 57) return '🌧️';
    if (code >= 61 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌡️';
  }
  
  getWeatherDescription() {
    if (!this.weatherData) return 'Loading...';
    const code = this.weatherData.weatherCode;
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2) return 'Partly cloudy';
    if (code === 3) return 'Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 57) return 'Drizzle';
    if (code >= 61 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 85 && code <= 86) return 'Snow showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
  }
  
  updateHeaderIcon() {
    const icon = this.getWeatherIcon();
    const temp = this.weatherData ? Math.round(this.weatherData.temp) : '--';
    const headerItems = document.querySelectorAll('.header-plugin-item');
    headerItems.forEach(item => {
      const iconEl = item.querySelector('.header-plugin-icon');
      if (iconEl) {
        item.innerHTML = `
          <span class="header-plugin-icon">${icon}</span>
          <span>${temp}${this.weatherData?.units || '°C'}</span>
        `;
      }
    });
  }
  
  updateGardenWidget() {
    const widget = document.getElementById('weather-garden-widget');
    if (!widget || !this.weatherData) return;
    widget.innerHTML = `
      <div class="weather-widget-content">
        <span class="weather-icon">${this.getWeatherIcon()}</span>
        <span class="weather-temp">${Math.round(this.weatherData.temp)}${this.weatherData.units}</span>
        <span class="weather-desc">${this.getWeatherDescription()}</span>
        <span class="weather-location">${this.settings.city}</span>
      </div>
    `;
  }
  
  renderGardenWidget(container) {
    if (!container) return;
    const widget = document.createElement('div');
    widget.className = 'weather-widget';
    widget.id = 'weather-garden-widget';
    if (this.weatherData) {
      widget.innerHTML = `
        <div class="weather-widget-content">
          <span class="weather-icon">${this.getWeatherIcon()}</span>
          <span class="weather-temp">${Math.round(this.weatherData.temp)}${this.weatherData.units}</span>
          <span class="weather-desc">${this.getWeatherDescription()}</span>
          <span class="weather-location">${this.settings.city}</span>
        </div>
      `;
    } else {
      widget.innerHTML = `
        <div class="weather-widget-content">
          <span class="weather-icon">🌤️</span>
          <span class="weather-temp">--</span>
          <span class="weather-desc">Loading...</span>
        </div>
      `;
    }
    widget.addEventListener('click', () => this.openWeatherModal());
    container.appendChild(widget);
  }
  
  openWeatherModal() {
    if (!this.weatherData) {
      this.context.ui.showNotification('🌤️', 'Weather data not available');
      return;
    }
    document.querySelector('.weather-modal')?.remove();
    
    const modal = document.createElement('div');
    modal.className = 'weather-modal';
    modal.innerHTML = `
      <div class="weather-modal-overlay"></div>
      <div class="weather-modal-content" style="max-width: 420px;">
        <div class="weather-modal-header">
          <h2>${this.settings.city}</h2>
          <button class="weather-modal-close">&times;</button>
        </div>
        <div class="weather-modal-body">
          <div class="weather-main">
            <span class="weather-main-icon">${this.getWeatherIcon()}</span>
            <span class="weather-main-temp">${Math.round(this.weatherData.temp)}${this.weatherData.units}</span>
          </div>
          <div class="weather-desc">${this.getWeatherDescription()}</div>
          <div class="weather-details">
            <div class="weather-detail"><span>Feels like</span><span>${Math.round(this.weatherData.feelsLike)}${this.weatherData.units}</span></div>
            <div class="weather-detail"><span>Humidity</span><span>${this.weatherData.humidity}%</span></div>
            <div class="weather-detail"><span>Wind</span><span>${this.weatherData.windSpeed} km/h</span></div>
          </div>
          
          <div class="weather-city-search" style="margin-top: 16px;">
            <label style="font-size: 12px; color: var(--text-tertiary);">Search city</label>
            <input type="text" class="weather-search-input" placeholder="Enter city name..." 
                   style="width: 100%; padding: 10px; border-radius: 8px; background: var(--bg-secondary); 
                          color: var(--text-primary); border: 1px solid var(--border-light); margin-top: 4px;">
            <div class="weather-search-results" style="max-height: 200px; overflow-y: auto; margin-top: 8px;"></div>
          </div>
          
          <div class="weather-popular" style="margin-top: 12px;">
            <label style="font-size: 12px; color: var(--text-tertiary);">Popular cities</label>
            <div class="weather-popular-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;">
              ${this.popularCities.slice(0, 6).map(c => 
                `<button class="weather-city-btn" data-lat="${c.lat}" data-lon="${c.lon}" data-name="${c.name}" 
                         style="padding: 6px 12px; background: var(--bg-tertiary); border: 1px solid var(--border-light); 
                                border-radius: 16px; font-size: 12px; cursor: pointer; color: var(--text-primary);">
                  ${c.name}
                </button>`
              ).join('')}
            </div>
          </div>
          
          <div class="weather-units-selector" style="margin-top: 16px;">
            <label style="font-size: 12px; color: var(--text-tertiary);">Units</label>
            <select class="weather-units-select" style="width: 100%; padding: 8px; border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-light); margin-top: 4px;">
              <option value="celsius" ${this.settings.units === 'celsius' ? 'selected' : ''}>Celsius (°C)</option>
              <option value="fahrenheit" ${this.settings.units === 'fahrenheit' ? 'selected' : ''}>Fahrenheit (°F)</option>
            </select>
          </div>
          <div class="weather-credit">Weather: Open-Meteo · Search: Local + Open-Meteo</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.weather-modal-close');
    const overlay = modal.querySelector('.weather-modal-overlay');
    const searchInput = modal.querySelector('.weather-search-input');
    const searchResults = modal.querySelector('.weather-search-results');
    const unitsSelect = modal.querySelector('.weather-units-select');
    
    closeBtn.onclick = () => modal.remove();
    overlay.onclick = () => modal.remove();
    
    searchInput.oninput = async () => {
      clearTimeout(this.searchTimeout);
      const query = searchInput.value.trim();
      if (query.length < 2) { searchResults.innerHTML = ''; return; }
      searchResults.innerHTML = '<div style="padding: 8px; color: var(--text-tertiary);">🔍 Searching...</div>';
      
      this.searchTimeout = setTimeout(async () => {
        const results = await this.searchCity(query);
        if (results.length === 0) {
          searchResults.innerHTML = '<div style="padding: 8px; color: var(--text-tertiary);">No cities found</div>';
          return;
        }
        searchResults.innerHTML = results.map(r => `
          <div class="weather-search-item" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${r.name}" 
               style="padding: 8px; cursor: pointer; border-radius: 6px; margin-bottom: 2px;"
               onmouseover="this.style.background='var(--bg-tertiary)'" 
               onmouseout="this.style.background='transparent'">
            <div style="font-weight: 500;">${r.name}</div>
            <div style="font-size: 11px; color: var(--text-tertiary);">${r.admin1 ? r.admin1 + ', ' : ''}${r.country}</div>
          </div>
        `).join('');
        
        searchResults.querySelectorAll('.weather-search-item').forEach(item => {
          item.onclick = async () => {
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const name = item.dataset.name;
            this.settings.lat = lat;
            this.settings.lon = lon;
            this.settings.city = name;
            await this.context.storage.set('settings', this.settings);
            modal.querySelector('.weather-modal-header h2').textContent = name;
            searchResults.innerHTML = '';
            searchInput.value = '';
            this.fetchWeather();
          };
        });
      }, 400);
    };
    
    modal.querySelectorAll('.weather-city-btn').forEach(btn => {
      btn.onclick = async () => {
        const lat = parseFloat(btn.dataset.lat);
        const lon = parseFloat(btn.dataset.lon);
        const name = btn.dataset.name;
        this.settings.lat = lat;
        this.settings.lon = lon;
        this.settings.city = name;
        await this.context.storage.set('settings', this.settings);
        modal.querySelector('.weather-modal-header h2').textContent = name;
        this.fetchWeather();
      };
    });
    
    unitsSelect.onchange = async () => {
      this.settings.units = unitsSelect.value;
      await this.context.storage.set('settings', this.settings);
      this.fetchWeather();
    };
    
    const escHandler = (e) => { if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);
    setTimeout(() => modal.classList.add('active'), 10);
  }
  
  checkExtremeWeather() {
    if (!this.weatherData) return;
    const temp = this.weatherData.temp;
    const weatherCode = this.weatherData.weatherCode;
    if (temp > 30) this.context.ui.showNotification('🔥', 'Stay hydrated! It\'s hot outside.');
    if (temp < 0) this.context.ui.showNotification('❄️', 'Bundle up! It\'s freezing.');
    if (weatherCode >= 95) this.context.ui.showNotification('⛈️', 'Thunderstorm warning! Stay safe.');
  }
}

return new WeatherPlugin(context, hooks);
