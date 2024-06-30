import React from 'react';
import { useScreenType } from '../../shared-hooks/useScreenType';

import BigHeader from './bigHeader';

const NormalHeader: React.FC = () => {
    const screenType = useScreenType();

    return (
        <>
            {(screenType === "desktop" || screenType === "mobile" || screenType === "tablet") && <BigHeader />}
        </>
    );
};

export default NormalHeader;