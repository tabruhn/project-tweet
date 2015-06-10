google.load('visualization', '1', {packages: ['motionchart']});

function drawVisualization() {
    var arr = readCSV("https://dl.dropboxusercontent.com/s/ckoki6aqolq34mm/analysis_new.csv");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = parseLineCSV(arr[i]);
    }

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Stock Name');
    data.addColumn('string', 'Time');
    data.addColumn('number', 'Net Sentiment (BUY - SELL)');
    data.addColumn('number', 'Change in Stock Price (x10^-4 %)');
    data.addColumn('number', 'Stock Tweets');
    data.addColumn('number', 'Cumulative Turnover (x10^6)');

    for (var i=0;i<arr.length;i++) { 
        data.addRows([
            [arr[i][0],arr[i][1],parseInt(arr[i][2]),parseInt(arr[i][3]),parseInt(arr[i][4]),parseInt(arr[i][5])],
        ]);
    }

    var motionchart = new google.visualization.MotionChart(
        document.getElementById('visualization'));
        var options = {};
        options['width'] = 800;
        options['height'] = 600;
        options['state'] = '{"xZoomedIn":false,"nonSelectedAlpha":0.4,"sizeOption":"4","yZoomedIn":false,"orderedByY":false,"showTrails":false,"duration":{"multiplier":1,"timeUnit":"W"},"xZoomedDataMin":-30,"playDuration":40000,"yLambda":0,"orderedByX":false,"yAxisOption":"3","xLambda":0,"colorOption":"5","xZoomedDataMax":150,"xAxisOption":"2","iconType":"BUBBLE","iconKeySettings":[],"uniColorForNonSelected":false,"yZoomedDataMin":-900,"dimensions":{"iconDimensions":["dim0"]},"yZoomedDataMax":900}';
        options['showChartButtons'] = true;
        options['showHeader'] = false;
        options['showSelectListComponent'] = false;
        options['showSidePanel'] = true;
        options['showXMetricPicker'] = true;
        options['showYMetricPicker'] = true;
        options['showXScalePicker'] = true;
        options['showYScalePicker'] = true;
        options['showAdvancedPanel'] = true;
        motionchart.draw(data, options);
}
    
var timeUnits = 0;
google.setOnLoadCallback(drawVisualization);

function changeTimeUnits(value) {
    timeUnits = parseInt(value, 10);
    drawVisualization();
}

function readCSV(locfile) {
    var req = new XMLHttpRequest();
    req.open("POST", locfile, false);
    req.send("");
    return req.responseText.split(/\n/g);
}

function parseLineCSV(lineCSV) {
    var CSV = new Array();
    lineCSV = lineCSV.replace(/,/g, " , ");
    lineCSV = lineCSV.split(/,/g);

    for (var i = 0; i < lineCSV.length; i++) {
        lineCSV[i] = lineCSV[i].replace(/\s*$/g, "");
    }
    lineCSV[lineCSV.length - 1] = lineCSV[lineCSV.length - 1].replace(/^\s*|\s*$/g, "");

    var fstart = -1;
    var quotedStr = false;
    var endQuotedStr = false;

    for (var i = 0; i < lineCSV.length; i++) {
        if (!quotedStr && lineCSV[i].match(/^\s*"/)) {
            quotedStr = true;
            fstart = i;
        }
        // If we are going out of a quoted string
        if (quotedStr && lineCSV[i].match(/"\s*$/)) {
            endQuotedStr = true;
        }
        // If this piece of string is inside the quoted string and it is not the first part
        // do concatenation
        if (quotedStr && fstart < i) {
            lineCSV[fstart] = lineCSV[fstart] + "," + lineCSV[i];
            lineCSV[i] = "-DELETED-";
        }
        // We are out of this quoted string, resets default values
        if (endQuotedStr) {
            quotedStr = false;
            endQuotedStr = false;
            fstart = -1;
        }
    }

    var j = 0;
    for (var i = 0; i < lineCSV.length; i++) {
        if (lineCSV[i] != "-DELETED-") {
            CSV[j] = lineCSV[i];
            CSV[j] = CSV[j].replace(/^\s*|\s*$/g, ""); // remove leading & trailing space
            CSV[j] = CSV[j].replace(/^"|"$/g, ""); // remove " on the beginning and end
            CSV[j] = CSV[j].replace(/""/g, '"'); // replace "" with "
            j++;
        }
    }

    return CSV;
}

$(document).ready(function() {
    createStoryJS({
        type: 'timeline',
        width: '350',
        height: '600',
        source: {"timeline":{"headline":"Stock Sentiments based on Twitter Data","type":"default","text":"<p> MSc(CS) Project COMP7802</p>","asset":{"media":"http://suddir.bitbucket.org","credit":"Sudharshan Ravindran, Briwon Zhao, Tyson Bruhn, Michael Chang","caption":""},"date":[{"startDate":"2013,9,29,9,1,13,432","endDate":"2013,9,29,9,1,13,432","headline":"buy","text":"<p>92,957,100 Miles from the Sun</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/TradersRule/statuses/395188576432193536","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,1,46,182","endDate":"2013,9,29,9,1,46,182","headline":"buy","text":"<p>Albany, New York</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/Dale67504978/statuses/395188714680246272","thumbnail":"","credit":"2013-10-29","caption":"AAPL,FB,PCLN"}},{"startDate":"2013,9,29,9,2,32,823","endDate":"2013,9,29,9,2,32,823","headline":"buy","text":"<p>Atlanta, GA</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/BareStock/statuses/395188909522419712","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,3,9,855","endDate":"2013,9,29,9,3,9,855","headline":"buy","text":"<p>medina</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/dalestrnad/statuses/395189065646997504","thumbnail":"","credit":"2013-10-29","caption":"NUGT,GDX,GLD,gold,spy,aapl,gold,dust,ung,xlf"}},{"startDate":"2013,9,29,9,3,31,39","endDate":"2013,9,29,9,3,31,39","headline":"buy","text":"<p>Chicago ... o Madrid.</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/mrtgr/statuses/395189154616598528","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,3,57,546","endDate":"2013,9,29,9,3,57,546","headline":"buy","text":"<p>NYC</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/TweetLeni/statuses/395189265845329920","thumbnail":"","credit":"2013-10-29","caption":"HAL"}},{"startDate":"2013,9,29,9,4,39,695","endDate":"2013,9,29,9,4,39,695","headline":"sell","text":"<p>Wall St, NYC</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/TradingGuru/statuses/395189442584911872","thumbnail":"","credit":"2013-10-29","caption":"AAPL,VIX,SPY,AMZN,NFLX,FB,GOOG,QQQ"}},{"startDate":"2013,9,29,9,5,5,79","endDate":"2013,9,29,9,5,5,79","headline":"sell","text":"<p>40 47' 48N / 74 28' 54W</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/GuyAdami/statuses/395189548797288448","thumbnail":"","credit":"2013-10-29","caption":"LLY"}},{"startDate":"2013,9,29,9,6,23,282","endDate":"2013,9,29,9,6,23,282","headline":"sell","text":"<p>USA</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/PeterGhostine/statuses/395189877014138883","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,7,12,778","endDate":"2013,9,29,9,7,12,778","headline":"buy","text":"<p>LOCATION: i'm here, now...</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/rtcode320/statuses/395190084548714496","thumbnail":"","credit":"2013-10-29","caption":"AAPL,NQ"}},{"startDate":"2013,9,29,9,8,46,658","endDate":"2013,9,29,9,8,46,658","headline":"sell","text":"<p>AnywherewithInternetConnection</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/stockguy22/statuses/395190477815033857","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,9,40,627","endDate":"2013,9,29,9,9,40,627","headline":"buy","text":"<p>Boston</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/mjciampa/statuses/395190704676151296","thumbnail":"","credit":"2013-10-29","caption":"aapl"}},{"startDate":"2013,9,29,9,10,27,738","endDate":"2013,9,29,9,10,27,738","headline":"buy","text":"<p>NYC</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/SenatoreSean/statuses/395190902479519744","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,10,39,298","endDate":"2013,9,29,9,10,39,298","headline":"buy","text":"<p>medina</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/dalestrnad/statuses/395190950911168513","thumbnail":"","credit":"2013-10-29","caption":"Nugt,gold,gld,ung,gdx,Dust,aapl,spy,xlf,xiv,uvxy"}},{"startDate":"2013,9,29,9,11,24,358","endDate":"2013,9,29,9,11,24,358","headline":"sell","text":"<p>Global</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/MorpheusTrading/statuses/395191139906498560","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,11,29,22","endDate":"2013,9,29,9,11,29,22","headline":"sell","text":"<p>Ashburn, VA</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/HurricaneDeLo/statuses/395191159389052928","thumbnail":"","credit":"2013-10-29","caption":"MRK"}},{"startDate":"2013,9,29,9,11,32,635","endDate":"2013,9,29,9,11,32,635","headline":"sell","text":"<p>London</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/Muppetmaker8/statuses/395191174446997504","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,11,32,955","endDate":"2013,9,29,9,11,32,955","headline":"sell","text":"<p>Boston MA</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/SnowShoes4/statuses/395191175780773888","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,12,55,66","endDate":"2013,9,29,9,12,55,66","headline":"buy","text":"<p>Gulf Coast AL/FL USA</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/Qwovadis/statuses/395191520262774784","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,14,10,166","endDate":"2013,9,29,9,14,10,166","headline":"sell","text":"<p>New York. NY</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/Convertbond/statuses/395191835314126848","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,14,25,115","endDate":"2013,9,29,9,14,25,115","headline":"sell","text":"<p>new york</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/noellenikpour/statuses/395191897955639297","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,14,26,34","endDate":"2013,9,29,9,14,26,34","headline":"sell","text":"<p>where the short squeeze is</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/vcutrader/statuses/395191901973794818","thumbnail":"","credit":"2013-10-29","caption":"T"}},{"startDate":"2013,9,29,9,14,42,715","endDate":"2013,9,29,9,14,42,715","headline":"sell","text":"<p>38.03514,-78.461857</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/kiggle/statuses/395191971788365824","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,15,37,86","endDate":"2013,9,29,9,15,37,86","headline":"sell","text":"<p>where the short squeeze is</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/vcutrader/statuses/395192199953915906","thumbnail":"","credit":"2013-10-29","caption":"aapl"}},{"startDate":"2013,9,29,9,15,59,382","endDate":"2013,9,29,9,15,59,382","headline":"buy","text":"<p>New York</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/Devas777Johnson/statuses/395192293193687041","thumbnail":"","credit":"2013-10-29","caption":"F"}},{"startDate":"2013,9,29,9,17,28,66","endDate":"2013,9,29,9,17,28,66","headline":"sell","text":"<p>Stamford, CT</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/KeithMcCullough/statuses/395192665488125953","thumbnail":"","credit":"2013-10-29","caption":"CAT"}},{"startDate":"2013,9,29,9,17,34,463","endDate":"2013,9,29,9,17,34,463","headline":"buy","text":"<p>Dallas, Tx</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/Traderfor3/statuses/395192692130324480","thumbnail":"","credit":"2013-10-29","caption":"MON"}},{"startDate":"2013,9,29,9,18,29,819","endDate":"2013,9,29,9,18,29,819","headline":"sell","text":"<p>Williamsburg Brooklyn</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/timrotolo/statuses/395192924239298560","thumbnail":"","credit":"2013-10-29","caption":"CAT"}},{"startDate":"2013,9,29,9,19,41,450","endDate":"2013,9,29,9,19,41,450","headline":"buy","text":"<p>Santa Barbara</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/HFTAlert/statuses/395193224761192448","thumbnail":"","credit":"2013-10-29","caption":"aapl"}},{"startDate":"2013,9,29,9,20,6,251","endDate":"2013,9,29,9,20,6,251","headline":"buy","text":"<p> check MY Twitter Favorites </p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/BUDDIEE18/statuses/395193328922152960","thumbnail":"","credit":"2013-10-29","caption":"aapl"}},{"startDate":"2013,9,29,9,21,6,574","endDate":"2013,9,29,9,21,6,574","headline":"buy","text":"<p>NYC</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/harmonicreason/statuses/395193581985464320","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,21,43,759","endDate":"2013,9,29,9,21,43,759","headline":"buy","text":"<p>London--Paris--New-York</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/Equitykingkong/statuses/395193737699414016","thumbnail":"","credit":"2013-10-29","caption":"aapl"}},{"startDate":"2013,9,29,9,23,29,367","endDate":"2013,9,29,9,23,29,367","headline":"sell","text":"<p>NYC</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/harmonicreason/statuses/395194180927897601","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,23,54,594","endDate":"2013,9,29,9,23,54,594","headline":"sell","text":"<p>NYC</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/harmonicreason/statuses/395194286725005312","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,24,12,446","endDate":"2013,9,29,9,24,12,446","headline":"buy","text":"<p>medina</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/dalestrnad/statuses/395194361605935104","thumbnail":"","credit":"2013-10-29","caption":"gdx,nugt,gold,gld,dust,spy,ung,xlf,aapl,xiv,uvxy"}},{"startDate":"2013,9,29,9,25,2,421","endDate":"2013,9,29,9,25,2,421","headline":"sell","text":"<p>USA Brazil Japan UK  Europe</p>","tag":"sell","classname":"sell","asset":{"media":"http://twitter.com/ADVFNplc/statuses/395194571057291264","thumbnail":"","credit":"2013-10-29","caption":"GM"}},{"startDate":"2013,9,29,9,25,25,738","endDate":"2013,9,29,9,25,25,738","headline":"buy","text":"<p>NYC</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/ianestepan/statuses/395194668742242304","thumbnail":"","credit":"2013-10-29","caption":"WFC,VRTX"}},{"startDate":"2013,9,29,9,25,35,918","endDate":"2013,9,29,9,25,35,918","headline":"buy","text":"<p>medina</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/dalestrnad/statuses/395194711750615040","thumbnail":"","credit":"2013-10-29","caption":"gdx,nugt,gold,gld,dust,spy,ung,xlf,aapl,xiv,uvxy"}},{"startDate":"2013,9,29,9,26,18,975","endDate":"2013,9,29,9,26,18,975","headline":"buy","text":"<p>watchlist access:</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/BioBounce/statuses/395194890713591808","thumbnail":"","credit":"2013-10-29","caption":"WFC,VRTX"}},{"startDate":"2013,9,29,9,26,19,866","endDate":"2013,9,29,9,26,19,866","headline":"buy","text":"<p>New York, NY</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/Minyanville/statuses/395194896014778368","thumbnail":"","credit":"2013-10-29","caption":"FCX,MRTX,FIO,ARDC"}},{"startDate":"2013,9,29,9,28,14,759","endDate":"2013,9,29,9,28,14,759","headline":"buy","text":"<p>NYC</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/harmonicreason/statuses/395195377990647808","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,29,17,922","endDate":"2013,9,29,9,29,17,922","headline":"buy","text":"<p>Cupertino</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/SwingTradeAlert/statuses/395195642823196672","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,29,22,713","endDate":"2013,9,29,9,29,22,713","headline":"buy","text":"<p>NYC</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/harmonicreason/statuses/395195663014563841","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,33,46,619","endDate":"2013,9,29,9,33,46,619","headline":"buy","text":"<p>Stillwater,OK</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/CeladonCPAs/statuses/395196769824276481","thumbnail":"","credit":"2013-10-29","caption":""}},{"startDate":"2013,9,29,9,34,34,258","endDate":"2013,9,29,9,34,34,258","headline":"buy","text":"<p>Toronto, Canada</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/bluser12/statuses/395196969557032961","thumbnail":"","credit":"2013-10-29","caption":"PEP"}},{"startDate":"2013,9,29,9,35,13,571","endDate":"2013,9,29,9,35,13,571","headline":"buy","text":"<p>WORLDWIDE</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/hovastocks/statuses/395197134393602048","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,36,8,371","endDate":"2013,9,29,9,36,8,371","headline":"buy","text":"<p>Glenolden, PA</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/RRossachacj/statuses/395197364073676801","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,36,46,942","endDate":"2013,9,29,9,36,46,942","headline":"buy","text":"<p>Gulf Coast AL/FL USA</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/Qwovadis/statuses/395197526254419969","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}},{"startDate":"2013,9,29,9,37,22,555","endDate":"2013,9,29,9,37,22,555","headline":"buy","text":"<p>Chicago</p>","tag":"buy","classname":"buy","asset":{"media":"http://twitter.com/IndyDimensions/statuses/395197675580043266","thumbnail":"","credit":"2013-10-29","caption":"AAPL"}}]}},
        embed_id: 'my-timeline'
    });
    setInterval(
        function() {
            VMM.fireEvent(".nav-next","click",this.onNextClick);
        }, 5000
    );
});
