import { useMemo, useState, useEffect, useRef } from 'react';
import './home.css';
import '../resource/font/importFont.css'

//Component
import Iridescent from "./iridescent/iridescent";
import Lightning from './lightning/lightning';
import Squares from './squares/squares'
import Particles from './particles/particles';
import MetaBalls from './metaballs/metaballs';
import Balatro from './balatro/balatro';

import Counter from './counter/counter';


export default function Home() {
  const [showSeconds, setShowSeconds] = useState(false);
  const [antiBurnIn, setAntiBurnIn] = useState(true);
  const [keepWake, setKeepWake] = useState(true)

  const [wakeLock,setWakeLock] = useState()
  const [antiBurnInPos, setAntiBurnInPos] = useState('position-1');


  const [isSettings, setIsSettings] = useState(false);
  const [background, setBackground] = useState('iridescent')

  const [time, setTime] = useState(new Date());

  // Add this useEffect to update the time every second
  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Clean up the interval when component unmounts
    return () => clearInterval(timerID);
  }, []);

  // Use time from state instead of directly creating a new Date
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  function summonCounter(value) {
    return (
      <Counter
        value={value}
        places={[10, 1]}
        fontSize={150}
        padding={0}
        gap={5}
        textColor="unset"
        fontWeight={0}
      />
    )
  }

  function summonHour() {
    let nowHour = hours
    if(hours < 10) {
      nowHour = '0' + hours
    }

    return ( summonCounter(parseInt(nowHour)) )
  }

  function summonMinute() {
    let nowMinute = minutes
    if(minutes < 10) {
      nowMinute = '0' + minutes
    }

    return ( summonCounter(parseInt(nowMinute)) )
  }

  function summonSeconds() {
    let nowSeconds = seconds
    if(seconds < 10) {
      nowSeconds = '0' + seconds
    }

    return (
      <>
        <span>:</span>
        {summonCounter(parseInt(nowSeconds))}
      </>
    )
  }



  //Background
  const summonIridescent = useMemo(() => (
    <Iridescent
      color={[0.5, 0.7, 1]}
      mouseReact={true}
      amplitude={0.1}
      speed={1.0}
    />
  ), [])

  const summonLightning = useMemo(() => (
    <Lightning
      hue={250}
      xOffset={0}
      speed={0.7}
      intensity={0.7}
      size={1.7}
    />
  ), [])

  const summonSquares = useMemo(() => (
    <Squares 
      speed={0.5} 
      squareSize={70}
      direction='diagonal' // up, down, left, right, diagonal
      borderColor='rgb(245, 245, 245, 0.1)'
      hoverFillColor='#222222'
    />
  ), [])

  const summonParticles = useMemo(() => (
    <Particles
      particleColors={['#F5F5F5', '#F5F5F5']}
      particleCount={200}
      particleSpread={15}
      speed={0.1}
      particleBaseSize={130}
      moveParticlesOnHover={true}
      alphaParticles={true}
      disableRotation={false}
    />
  ), [])

  const summonMetaBalls = useMemo(() => (
    <MetaBalls
      color="#ffffff"
      cursorBallColor="#ffffff"
      cursorBallSize={1.5}
      ballCount={20}
      animationSize={30}
      enableMouseInteraction={true}
      enableTransparency={true}
      hoverSmoothness={0.2}
      clumpFactor={1.2}
      speed={0.3}
    />
  ), [])

  const summonBalatro = useMemo(() => (
    <Balatro
      isRotate={true}
      mouseInteraction={true}
      pixelFilter={2000}
    />
  ), [])



  //Scripting
  const selectorHovering = useRef(null)
  useEffect(() => {
    if(!isSettings) {
      selectorHovering.current.blur()
    }
  }, [isSettings])

  function changeShowSeconds() {
    if(showSeconds) {
      setShowSeconds(false)
    } else if(!showSeconds) {
      setShowSeconds(true)
    }
  }

  function changeAntiBurnIn() {
    if(antiBurnIn) {
      setAntiBurnIn(false)
    } else if(!antiBurnIn) {
      setAntiBurnIn(true)
    }
  }


  const positionIntervalRef = useRef(null)
  useEffect(() => {
    if(antiBurnIn) {
      if(positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
      
      positionIntervalRef.current = setInterval(() => {
        setAntiBurnInPos(prevPos => {
          if(prevPos === 'position-1') return 'position-2';
          if(prevPos === 'position-2') return 'position-3';
          return 'position-1';
        });
      }, 300000); // Note: this should be a number, not an array
    } else if (!antiBurnIn) {
      // Clear interval when antiBurnIn is false
      if(positionIntervalRef.current) {
        setAntiBurnInPos('position-1')
        clearInterval(positionIntervalRef.current);
        positionIntervalRef.current = null;
      }
    }
    
    return () => {
      if(positionIntervalRef.current) {
        clearInterval(positionIntervalRef.current);
      }
    };
  }, [antiBurnIn]);

  function changeKeepWake() {
    if(keepWake !== 'unsupported') {
      if(keepWake) {
        setKeepWake(false)
      } else if(!keepWake) {
        setKeepWake(true)
      }
    }
  }
 
  async function requestWake() {
    try {
      if ('wakeLock' in navigator) {
        // Request a screen wake lock
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setKeepWake(true);
        
        lock.addEventListener('release', () => {
          setWakeLock(null);
          setKeepWake(false);
        });
        
      } else {
        setKeepWake('unsupported')
      }
    } catch (err) {
      console.error(`Failed to obtain wake lock: ${err.message}`);
    }
  }

  //eslint-disable-next-line
  function releaseWakeLock() {
    if (wakeLock) {
      wakeLock.release()
        .then(() => {
          setWakeLock(null);
          setKeepWake(false);
        })
        .catch((err) => {
          console.error(`Failed to release wake lock: ${err.message}`);
        });
    }
  }
  useEffect(() => {
    if (keepWake) {
      requestWake()
    } else {
      releaseWakeLock()
    }
    //eslint-disable-next-line
  }, [keepWake])
  
  return(
    <>
      <div id='tooSmall-screen'>
        <div id='--image' /><br/>
        <div id='--caption-title'>Screen is too small.</div>
        <div id='--caption-desc'>The screen size is too small to display the content properly. The minimum width is 900 px, while your current screen width is {window.innerWidth} px. You can try to enlarge the browser window size or decrease the browser screen zoom.</div>
      </div>
      <div id="htmlWrapper">
        <div id='htmlBackground'>
          {background === 'iridescent' ? summonIridescent : ''}
          {background === 'lightning' ? summonLightning : ''}
          {background === 'squares' ? summonSquares : ''}
          {background === 'particles' ? summonParticles : ''}
          {background === 'metaballs' ? summonMetaBalls : ''}
          {background === 'balatro' ? summonBalatro : ''}

        </div>

        <div id='--clock' className={`--clock ${showSeconds ? 'withSeconds' : ''} ${background === 'squares' || background === 'particles' ? 'isLight' : ''} ${antiBurnInPos}`}>{summonHour()}.{summonMinute()}{showSeconds ? summonSeconds() : ''}</div>

        <div 
          id='settings-div' 
          className={`settingsDiv ${isSettings ? 'opened' : 'closed'}`} 
          onMouseOver={() => setIsSettings(true)} 
          onMouseLeave={() => setIsSettings(false)}
        >
          <div id='settings-content' className={`settingsContent ${isSettings ? 'opened' : 'closed'}`}>
            <div id='settings-title'>Settings</div><br/>
            <div id='settings-content-prop'>
              <select id='selectBackground' onChange={(ev) => setBackground(ev.target.value)} ref={selectorHovering}>
                <option value='iridescent'>Iridescent</option>
                <option value='lightning'>Lightning</option>
                <option value='squares'>Squares</option>
                <option value='particles'>Particles</option>
                <option value='metaballs'>MetaBalls</option>
                <option value='balatro'>Balatro</option>
              </select><br/>

              <div className='checkBox-input'>
                <input type='checkbox' className='ui-checkbox' onChange={changeKeepWake} checked={keepWake} /> Keep screen on
              </div>

              <div className='checkBox-input'>
                <input type='checkbox' className='ui-checkbox' onChange={changeShowSeconds}/> Show Seconds<br/>
              </div>

              <div className='checkBox-input'>
                <input type='checkbox' className='ui-checkbox' onChange={changeAntiBurnIn} checked={antiBurnIn} /> Burn-in prevention
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}