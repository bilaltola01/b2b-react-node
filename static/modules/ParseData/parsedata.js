/*
Vars:
--------
- Title:
(Pharos.Playlist[0].Block[0].PlaylistItem[i].Template[0].DataElementList[0].DataElement[j].Name === 'video')(Pharos.Playlist[0].Block[0].PlaylistItem[i].Template[0].DataElementList[0].DataElement[j].Value[0].DataElementCompoundList[0].DataElementList[0].DataElement[1].Value[0])

- Program I.D: (Pharos.Playlist[i].Block[0].PlaylistItem[j].Template[0].DataElementList[0].DataElement[0].Value[0].DataElementCompoundList[0].DataElementList[0].DataElement[0].Value[0])

- Tx Time: (Pharos.Playlist[i].Block[0].PlaylistItem[j].ScheduledDuration[0])
- Channel: Channel Name (Pharos.Playlist[i].ChannelName[0])
- Status: (Pharos.Playlist[0].Block[0].PlaylistItem[i].Template[0].DataElementList[0].DataElement[j].Name === 'bug')

*/


// Use template for its html
function parseJSONFile(jsonFile, callback) {
    var json_dir, json_url;
    
    if (!jsonFile) {
        return;
    }
    
    json_dir = 'data/json';
    json_url = json_dir + '/min/' + jsonFile + '.json';
    $.ajax({
        url: json_url,
        method: 'GET',
        async: true,
        contentType: 'application/json',
        success: function (data) {
            callback(data);
        }
    }); 
}

function parseJSONFiles(jsonFilesArray, callback){
    var len, results, counter, i;
    
    results = [];
    counter = 0;
    
    if(!jsonFilesArray){
        return;
    }
    
    for(i = 0, len = jsonFilesArray.length; i < len; i++){
        results[i] = null;
        (function(i){
            parseJSONFile(jsonFilesArray[i], function(data){
                var j, jlen, k, klen, channel, playlistItem, dataElement, addToArray, channels;

                channels = [];
                
                if(!data){
                    return;
                }

                // Loop through the PlaylistItems
                for (j = 0, jlen = data.Pharos.Playlist[0].BlockList[0].Block[0].PlaylistItem.length; j < jlen; j++) {
                    addToArray = false;
                    playlistItem = data.Pharos.Playlist[0].BlockList[0].Block[0].PlaylistItem[j];

                    channel = {
                        title: null,
                        programId: null,
                        time: null,
                        name: null,
                        status: null
                    };

                    // Channel name
                    channel.name = data.Pharos.Playlist[0].ChannelName[0];

                    // Tx Time
                    channel.time = playlistItem.ScheduledDuration[0];

                    // Loop through the DataElements
                    for (k = 0, klen = playlistItem.Template[0].DataElementList[0].DataElement.length; k < klen; k++) {
                        dataElement = playlistItem.Template[0].DataElementList[0].DataElement[k];

                        if (dataElement.Name[0] === 'video') {
                            channel.title = dataElement.Value[0].DataElementCompoundList[0].DataElementList[0].DataElement[1].Value[0];
                            channel.programId = dataElement.Value[0].DataElementCompoundList[0].DataElementList[0].DataElement[0].Value[0];
                        }

                        if (dataElement.Name[0] === 'bug') {
                            //console.log('bug in item number: ' + j + ' and channel number: ' + i);
                            channel.status = 'issue';
                            addToArray = true;
                        }
                    }

                    if(addToArray){
                        //console.log('Channel:' + channel);
                        channels.push(channel);
                    }

                }
                
                results[i] = channels;
                console.log(i, counter);
                if (++counter === jsonFilesArray.length) {
                    console.log(results);
                    callback(results);
                    //reset(results);
                }
            });
        })(i);
         
    }   
}

function reset(arr){
    for(i = 0, i < arr.length; i < len; i++){
        for(j = 0, len = arr[i].length; j < len; i++){
            results[i][j] = null;
        }
    }
}