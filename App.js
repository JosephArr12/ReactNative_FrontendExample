import * as React from 'react';
import {useEffect, useState, useRef} from 'react';
import {Text, View, StyleSheet, TextInput, Image, ImageBackground, TouchableOpacity,ScrollView,Animated} from 'react-native';
import Constants from 'expo-constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
const spacing = 50;
const genres=[{name:"pop",gif:"https://media.newyorker.com/photos/5a2eecdfd0152e62fb02169b/master/w_2560%2Cc_limit/TNY-Best-Music.gif"},{name:"rock",gif:"https://condor.depaul.edu/~dweinste/rock/fest-audience.gif"},{name:"hip-hop",gif:"https://media.tenor.com/zNlgXfqMvL4AAAAC/music-boom-box.gif"}]

const browse=[{name:"Pop",uri:'https://pyxis.nymag.com/v1/imgs/3a3/b1f/2141226b8ab1ae07afe4b541ee0d2b0825-11-yic-pop-essay.rsocial.w1200.jpg'},{name:"Rock",uri:'https://schoolofrock.imgix.net/img/news-article-hero-750w/allstarsdallas050-edit-1677013329.jpg?auto=format'},{name:"Hip hop",uri:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Wu_Tang_Clan_West_Holts_Stage_Glastonbury_2019_007.jpg/2048px-Wu_Tang_Clan_West_Holts_Stage_Glastonbury_2019_007.jpg'},{name:"Country",uri:'https://cdn.britannica.com/92/103092-050-B3A9359C/Willie-Nelson-concert-USO-Ramstein-Air-Base-2005.jpg'},{name:"Jazz",uri:'https://cdn.windowsreport.com/wp-content/uploads/2020/04/best-jazz-music-software-1200x900.jpg'},{name:"Blues",uri:'https://image.pbs.org/video-assets/ak1hGZn-asset-mezzanine-16x9-0HDxDfC.png'},{name:"Metal",uri:'https://flypaper.soundfly.com/wp-content/uploads/2016/10/metal-covers-header.png'},{name:"Electronic",uri:'https://www.visittheusa.com/sites/default/files/styles/16_9_1280x720/public/images/hero_media_image/2018-03/1f193ea1be6ff6877e025ed15bc58e04.jpeg?h=2e3eca71&itok=iDgLVnqF',},{name:"World",uri:'https://www.kennedy-center.org/globalassets/education/resources-for-educators/classroom-resources/artsedge/media/young-peoples-concert/2011-a-world-of-music/ypc-a-world-of-music-169.jpg'},{name:"Reggae",uri:'https://c.files.bbci.co.uk/1E53/production/_104536770_bob_getty.jpg'},{name:"Soul",uri:'https://e.snmc.io/i/150/s/87dff9645223294f20ef8061c164ee30/6065579'},{name:"Theatre",uri:'https://media.csmusic.net/wp-content/uploads/2019/08/28153314/Donna-Maure.jpg'},{name:"Folk",uri:'https://wpr-public.s3.amazonaws.com/wprorg/field/image/ap_791788173911.jpg'},{name:"Funk",uri:'https://www.liveabout.com/thmb/gmyuH5cI7GWTMhJrtW2GCzItles=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-579175664-59b30c26396e5a0010532c36.jpg'},{name:"Indie",uri:'https://www.magneticmag.com/.image/t_share/MTkxMzY2ODE0MzY0NjA4MDk4/what-is-indie-music--magnetic-magazine--clay-banks.webp'},{name:"Latin",uri:'https://www.smallworldfs.com/filemanager/userfiles/blog/influenciasmusicaLatinoamericana.jpg'},{name:"House",uri:'https://s3.eu-central-1.amazonaws.com/armadafuga/uploads/news/_1200x630_crop_center-center_82_none/House-music-1800x960.png?mtime=1612863776'},{name:"Disco",uri:'https://www.liveabout.com/thmb/Yt8KHrbbXhs87NRuI7JK6HkOP68=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/low-angle-view-of-illuminated-disco-ball-960759378-5c7c16b946e0fb00011bf325.jpg'}]

const song = {name:"Honey Jam",artist:"Massobeats",uri:'https://i1.sndcdn.com/artworks-FKZnizBm66BJpQjd-ylYMHw-t500x500.jpg',color:'#7C793C'}

function getColor(){
  var randomColor = Math.floor(Math.random()*16777215).toString(16);
  return "#" + randomColor;
}

function Song() {
  const soundRef = useRef(null);
  const [playing, setPlaying] = useState('play');
  const [progress, setProgress] = useState(0);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/hj.mp3')
    );
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    soundRef.current = sound; // Assign the sound to the ref
  };

  useEffect(() => {
    loadSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const pressButton = async () => {
    if (playing === 'play') {
      playSound();
    } else {
      pauseSound();
    }
  };

  const playSound = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setPlaying('pause');
    }
  };

  const pauseSound = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setPlaying('play');
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && status.isPlaying) {
      const currentPosition = status.positionMillis || 0;
      const songDuration = status.durationMillis || 1; // To avoid division by zero
      var songProgress = currentPosition / songDuration;
      if(songProgress>1){
        songProgress=1;
      }
      setProgress(songProgress);
    }
    if (status.didJustFinish) {
      resetSound();
    }
  };

  const resetSound = async () => {
    console.log('Resetting sound');
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setPlaying('play');
      setProgress(0);
    }
  };


    return (
      <View style={{flexDirection:'row',bottom:90,alignContent:'center',backgroundColor:song.color,height:53,width:360,position:'absolute',borderRadius:5,alignItems:'center',opacity:"100%"}}>
      <Image source={{uri:song.uri}} style={{height:38,width:38,borderRadius:3, left:7,bottom:2,opacity:"100%"}}/>
      <View style={{marginRight:30,marginLeft:17,justifyContent:'center'}}>
        <Text style={{color:'white',fontWeight:'450',fontSize:13}}>{song.name}</Text>
        <Text style={{color:'#CECECE',fontWeight:'450',fontSize:13}}>{song.artist}</Text>
      </View>

      <View style={{flexDirection:'row', alignContent:'flex-end',left:150}}>
        <TouchableOpacity onPress={()=>pressButton()}>
          <FontAwesome5 name={playing} size={20} color='white'/>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection:'row',bottom:0,alignContent:'center',backgroundColor:'gray',height:2,width:350,position:'absolute',borderRadius:5,left:5}}></View>
      <View style={{flexDirection:'row',bottom:0,alignContent:'center',backgroundColor:'white',height:2,width:`${progress * 100}%`,position:'absolute',borderRadius:5,left:5}}>

      </View>
      </View>
  );

}

function Genres() {
  const spacing = 15;
  return (
    <View style={{ alignSelf: 'center',left:5}}>
      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Explore your genres</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center',alignItems:'center',alignContent:'center',alignSelf:'center' }}>
        {genres.map((genre) => {
          return (
            <View style={{ marginRight: spacing }}>
              <View style={{ alignItems: 'center' }}>
                <ImageBackground
                  style={{ width: 100, height: 190 }}
                  imageStyle={{ borderRadius: 6 }}
                  source={{ uri: genre.gif }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, textAlign: 'center', bottom: 10, left: 10, position: 'absolute' }}>
                    #{genre.name}
                  </Text>
                </ImageBackground>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}


function Browse(){
      return (
      <View style={{marginTop:20,alignSelf:'center',left:20}}>
      <View>
        <Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>Browse all</Text>
      </View>
      <View style={{flex:1,flexDirection:'row',flexWrap:'wrap'}}>
      {browse.map((genre) => {
        return (
          <View style={{marginRight:20,marginVertical:10}}>
            <View style={{height:95,width:156,backgroundColor:getColor(),borderRadius:5,overflow: 'hidden',}}>
            <Image source={{uri:genre.uri}} style={{height:70,width:70,borderRadius:10, transform: [{ rotate: '30deg'}],left:115,}}/>
            </View>

              <Text style={{color:'white',fontWeight:'bold',fontSize:17,textAlign:'center',position:'absolute',left:10,top:10}}>{genre.name}</Text>

          </View>    
        );
      })}
      </View>
    </View>

  );
}

function Header(){
    return (
      <View style={{alignSelf:'center',height:100}}>
      <View style={{marginBottom:10, flexDirection:'row',alignItems:'center'}}>
        <Text style={{color:'white',fontSize:23,fontWeight:'bold'}}>Search</Text>
        <View style={{position:'absolute',right:0}}>
        <FontAwesome5 name={'camera'} size={22} color={"white"} style={{alignSelf:'flex-end'}}/>
        </View>
      </View>
      <View style={styles.searchBar}>
        <FontAwesome5 name={'search'} size={22} color={"black"}/>
        <View style={{marginRight:10}}></View>
        <TextInput placeholder="What do you want to listen to?" placeholderTextColor='black' fontWeight="400" fontSize={16}/>
      </View>
      </View>
  );
}

function NavBar(){
  const iconSize = 23;
  const spacing = 29;
  return (
    <View style={styles.navBarContainer}>     
    <LinearGradient
     colors = {['transparent','#131313']}
     style = {styles.background}
     start={{x:0,y:0.2}}
     end={{x:0,y:1.0}}
    />
      </View>
  );
}

function NavButtons(){
  return (
    <View style={{position:'absolute',bottom:40,flexDirection:'row'}}>
      <View style = {{alignItems:'center',justifyContent:'center'}}>
        <FontAwesome5 name={'home'} size={22} color={'gray'}/>
        <Text style={styles.navBarText}>Home</Text>
      </View>
      <View style = {{marginHorizontal:spacing}}></View>
        <View style = {{alignItems:'center',justifyContent:'center'}}>
          <FontAwesome5 name={'search'} size={22} color={'white'}/>
          <Text style={styles.navBarTextHighlighted}>Search</Text>
        </View>
      <View style = {{marginHorizontal:spacing}}></View>
        <View style = {{alignItems:'center',justifyContent:'center'}}>
          <FontAwesome5 name={'book'} size={22} color={'gray'}/>
          <Text style={styles.navBarText}>Library</Text>
        </View>
    </View>
  );
}


export default function App() {
  return (
    <View style={styles.container}>

      <View style={{}}>
        <Header/>
        <ScrollView
        horizontal={false}
        directionalLockEnabled={true}
        contentContainerStyle={styles.mainScroll}
        scrollIndicatorInsets={{ top: 50, bottom: 150 }}
        >
          <Genres/>
          <Browse/>
        </ScrollView>
      </View>
      <NavBar/>
      <NavButtons/>
      <Song/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight+30,
    backgroundColor:'#131313',
    alignContent:'center',
    alignItems:'center'
  },
  searchBar:{
    flexDirection:'row',
    alignItems:'center',
    paddingLeft:18,
    height:45,
    width:335,
    backgroundColor:'white',
    borderRadius:5,
  },
  navBarText:{
    top:7,
    fontSize:10,
    color:'gray',
    textAlign:'center',
    alignSelf:'center',
    fontWeight:'bold',
  },
  navBarTextHighlighted:{
    top:7,
    fontSize:10,
    color:'white',
    textAlign:'center',
    alignSelf:'center',
    fontWeight:'bold',
  },
  mainScroll:{
    paddingBottom: 150

  },
  background: {
    width:'120%',
    height:90,
    paddingHorizontal:10,
  },
  navBarContainer:{
    position:'absolute',
    bottom:0,
    width:'120%',
    alignItems:'center',
    display:'flex',
    backgroundColor:'#131313',
    opacity:0.97
  }
});