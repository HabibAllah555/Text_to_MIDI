var fs = require('fs'); 
var tonal =require("tonal");
var MidiWriter = require('midi-writer-js');
var t=fs.readFileSync("notes")
var str=t.asciiSlice()
// Start with a new track
var track = new MidiWriter.Track();
track.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 10}));
var lines=str.split("\n")
var notes=[]
//line parser
function parseLine(line) {
	if(line.length==0)
		return
	if(line[0]=="#")
		return
	var temp=line.split(",")
	temp=temp.map((x)=>{return x.trim()})
	notes.push(new MidiWriter.NoteEvent({pitch: tonal.Chord.notes(temp[1]), duration: temp[0]}))
}
lines.forEach((x)=>{
	parseLine(x)
})
track.addEvent(notes);
 
// Generate a data URI
var write = new MidiWriter.Writer([track]);
var base64String = write.base64();
// Strip off the header
var data = base64String.split("base64,").pop();
// Write the file
fs.writeFileSync("output.mid", data, {encoding: 'base64'});
