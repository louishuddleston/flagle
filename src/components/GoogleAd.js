import React, { useEffect } from 'react';
import styled from 'styled-components';

const StyledIns = styled.ins`
    width: 320px;  
    height: 100px;
    @media (min-width:500px) { 
        width: 468px; 
        height: 60px; 
    }
    @media (min-width:800px) { 
        width: 728px; 
        height: 90px; 
    }
`;
function GoogleAds(props) {
    const { currentPath } = props
    useEffect(() => {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({
        overlays: {bottom: true}
        })
    }, [])
    return (
        <div>
            <StyledIns className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-8549840240508631"
                data-ad-slot={props.slot}
                >
            </StyledIns>
        </div>
    );
}
export default GoogleAds;