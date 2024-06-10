import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/get-started-button';
import { HeaderUi } from '../components/ui/Header-ui';
import { FooterUi } from '../components/ui/Footer-ui';
import { useSelectedRepo } from '../components/SelectedRepoProvider';
import { useNavigate } from 'react-router-dom';

const DataDisplay = () => {
  const { selected } = useSelectedRepo();
  const [bulletPoints, setBulletPoints] = useState([]);
  const [copied, setCopied] = useState(false)

  // const testBulletPoints = [
  //   'Used React to develop an application which mirrors the functionality of Chrome Developer Tools Styles tab but displays source file names and line numbers for all types of CSS styles, enabling faster CSS debugging and development.',
  //   'Integrated DOM and CSS domains of Chrome Developer Protocol to communicate directly with browser’s functionality without abstraction layers provided by higher-level libraries and to fetch CSS property data of the target application.',
  //   'Implemented Redux Toolkit, using Immer and Redux thunks to simplify state management across multiple React components, handle asynchronous HTTP and API requests, ensure immutable state update and efficient data flow.'
  // ];

  const navigate = useNavigate();

  useEffect(() => {
    // console.log('DataDisplay: Fetching bullet points data for repo', selected);
    fetch('/api/openai/generate/bulletPoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repoName: selected })
    })
      .then(res => {
        // console.log('DataDisplay: Fetched data from API:', res);
        return res.json();
      })
      .then(data => {
        console.log('DataDisplay: Fetched data from API. data.bulletPoints:', data.bulletPoints);
        setBulletPoints(data.bulletPoints)
      })
      .catch(err => console.error(`DataDisplay: Error fetching bullet points for repo ${selected}. Error: ${err}`))

  }, []);


  console.log('dataDisplay: bulletPoints', bulletPoints);
  // console.log('dataDisplay: typeof bulletPoints', typeof bulletPoints);

  const bulletPointElements = Array.isArray(bulletPoints) && bulletPoints.length ? bulletPoints.map((bp, idx) => (
    <li key={`bullet-point-${idx}`} className='text-white my-4'>{bp}</li>
  )) : null;

  const handleCopyToClipboardClick = async () => {
    const bulletPointTexts = bulletPoints.join('\n• ');
    const textToCopy = `• ${bulletPointTexts}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const showLoading = () => {
    return (
      <>
        <div className="loader w-32 h-32 border-8 border-black border-t-lavenderGR rounded-full animate-spin">
        </div>
        <h2 className="text-white font-grotesk">Bullet Points Loading...</h2>
      </>
    )
  }

  return (
    <div>
      <header className='p-8 text-sm text-white absolute top-0 left-0 z-10 font-grotesk'>
        <a href=''></a>
      </header>
      <HeaderUi
        buttonOnClick={() => navigate('/repodisplay')}
        buttonContent='Your Repos'>
      </HeaderUi>


      <main className='flex items-center justify-center h-screen bg-blackGR'>
        <div className='bg-darkGrayGR w-3/4 h-3/4 rounded-3xl pt-7 px-10 font-sans flex flex-col items-center justify-between'>
          <div>
            <h1 className='text-greenGR text-2xl mb-5'>repo: {selected}</h1>
            <ul className='list-disc list-inside'>
              {bulletPointElements}
            </ul>
          </div>
          {!bulletPointElements ? showLoading() : ''}
          <div>
            <Button
              className={copied ? `my-2 hover:bg-lavenderGR focus:bg-blueGR` : `my-8 hover:bg-lavenderGR focus:bg-blueGR`}
              variant='default'
              onClick={handleCopyToClipboardClick}
            >Copy To Clipboard</Button>
            {copied ? <h2 className="text-white text-sm mb-8 text-center font-sans" >Copied successfully <span className="animate-[wiggle_1s_ease-in-out_infinite]">✅</span></h2> : ''}
          </div>
        </div>
      </main>
      <FooterUi className='mt-auto'/>
    </div>
  )
}

export default DataDisplay;
