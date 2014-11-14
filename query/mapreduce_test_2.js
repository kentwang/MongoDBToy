var mapDetails = function(){
    var output = {studentid: this.studentid, classes_1: [], classes_2: [], year: this.year, overall: 0, subscore: 0}
    if (this.year == 1) {
        output.classes_1 = this.classes;
    }
    if (this.year == 2) {
        output.classes_2 = this.classes;
    }
    emit(this.studentid, output);
};

var mapGpas = function() {
    emit(this.studentid, {studentid: this.studentid, classes_1: [], classes_2: [], year: 0, overall: this.overall, subscore: this.subscore});
};

var r = function(key, values) {
    var outs = { studentid: "0", classes_1: [], classes_2: [], overall: 0, subscore: 0};

    values.forEach(function(v){
        outs.studentid = v.studentid;
        v.classes_1.forEach(function(class){if(outs.classes_1.indexOf(class)==-1){outs.classes_1.push(class)}})
        v.classes_2.forEach(function(class){if(outs.classes_2.indexOf(class)==-1){outs.classes_2.push(class)}})

        if (v.year == 0) {
            outs.overall = v.overall;
            outs.subscore = v.subscore;
        }
    });
    return outs;
};

res = db.details.mapReduce(mapDetails, r, {out: {reduce: 'joined'}})
res = db.gpas.mapReduce(mapGpas, r, {out: {reduce: 'joined'}})