import React, { useEffect, useState } from 'react';

import { DropDownSpace } from "./component/Dropdown";
import { ModalSpace } from '../Modal';
import '../../styles/ui/header/bigHeader.css';

export interface HeaderProps {}

const BigHeader: React.FC<HeaderProps> = ({}) => {
  interface NavItemProps {
      id: string;
      href: string;
      label: string;
      handleMouseOver: (id: string) => void;
  }

  const [isDesktopNavHidden, setDesktopNavHidden] = useState(false);
  const [isSearchContainerHidden, setSearchContainerHidden] = useState(true);
  const [isOverlayShown, setOverlayShown] = useState(false);
  const [isNavContainerActive, setNavContainerActive] = useState(false);
  const [isSearchBarActive, setSearchBarActive] = useState(false);
  const [isNavMovedUp, setNavMovedUp] = useState(false);
  const [isDesktopNavMovedDown, setDesktopNavMovedDown] = useState(false);
  const [isModalActive, setModalActive] = useState(false);
  const [isWideHeaderVisible, setWideHeaderVisible] = useState(true);

  const handleSearchButtonClick = () => {
    setDesktopNavHidden(true);
    setSearchContainerHidden(false);
    setOverlayShown(true);
  };

  const handleCloseButtonClick = () => {
    setDesktopNavHidden(false);
    setSearchContainerHidden(true);
    setOverlayShown(false);
  };

  const handleOverlayClick = () => {
    setDesktopNavHidden(false);
    setSearchContainerHidden(true);
    setOverlayShown(false);
  };

  const handleMenuIconContainerClick = () => {
    setNavContainerActive(!isNavContainerActive);
  };

  const handleSearchInputClick = () => {
    setSearchBarActive(true);
    setNavMovedUp(true);
    setDesktopNavMovedDown(true);
  };

  const handleCancelBtnClick = () => {
    setSearchBarActive(false);
    setNavMovedUp(false);
    setDesktopNavMovedDown(false);
  };

  const NavItem: React.FC<NavItemProps> = ({ id, href, label, handleMouseOver }) => (
    <li id={id} onMouseOver={() => handleMouseOver(id)} onClick={() => { if (id !== '급식증' && id !== '홈' && id !== '시간표' && id !== '급식표') {setModalActive(true); setIsFadingOut(false); setWideHeaderVisible(true)} }}>
      <a href={href} className="nav-link">{label}</a>
    </li>
  );

  const navItems = [
    { id: '급식증', href: '/qr', label: '급식증' },
    { id: '홈', href: '/', label: '홈' },
    { id: '시간표', href: '/time', label: '시간표' },
    { id: '급식표', href: '/meal', label: '급식표' },
    { id: '메세지', href: '#', label: '메세지' },
    { id: '프로필', href: '#', label: '프로필' },
  ];

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleMouseOver = (id: string) => {
    setActiveItem(id);  
    if (isFadingOut) {
      setIsFadingOut(false);
    }
  }
  
  const handleMouseOut = () => {
    setIsFadingOut(true);
  }

  useEffect(() => {
    if (isFadingOut) {
      const timeout = setTimeout(() => {
        setActiveItem(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isFadingOut]);

  return (
    <div onMouseLeave={handleMouseOut}>
      <div className={`nav-container ${isNavContainerActive ? 'active' : ''}`}>
        <nav>
          <ul className="mobile-nav">
            <li>
              <div className="menu-icon-container" onClick={handleMenuIconContainerClick}>
                <div className="menu-icon">
                  <span className="line-1"></span>
                  <span className="line-2"></span>
                </div>
              </div>
            </li>
            <li><a href="#" className="link-logo"></a></li>-
          </ul>
          <ul className={`desktop-nav ${isDesktopNavHidden ? 'hide' : ''}`}>
            {navItems.map(item => (
                <NavItem key={item.id} {...item} handleMouseOver={handleMouseOver} />
            ))}
            <li>
              <a href="#" className="link-search" onClick={handleSearchButtonClick}></a>
            </li>
          </ul>
        </nav>
        <div className={`search-container ${isSearchContainerHidden ? 'hide' : ''}`}>
          <div className="link-search"></div>
          <div className="search-bar">
            <form action="">
              <input type="text" placeholder="Search on Feed" />
            </form>
          </div>
          <div className="link-close" onClick={handleCloseButtonClick}></div>
          <div className="quick-links">
            <h2>Recommendations</h2>
            <ul>
              <li><a href="#">병신</a></li>
              <li><a href="#">새끼</a></li>
              <li><a href="#">야</a></li>
              <li><a href="#">시</a></li>
              <li><a href="#">발</a></li>
            </ul>
          </div>
        </div>
        <div className={`mobile-search-container ${isSearchBarActive ? 'active' : ''}`}>
          <div className="link-search"></div>
          <div className="search-bar">
            <form action="">
              <input type="text" placeholder="Search on Feed" onClick={handleSearchInputClick} />
            </form>
          </div>
          <span className="cancel-btn" onClick={handleCancelBtnClick}>Cancel</span>
          <div className="quick-links">
            <h2>Recommendations</h2>
            <ul>
              <li><a href="#">병신</a></li>
              <li><a href="#">새끼</a></li>
              <li><a href="#">야</a></li>
              <li><a href="#">시</a></li>
              <li><a href="#">AirTag</a></li>
            </ul>
          </div>
        </div>
      </div>
      {isWideHeaderVisible && (
        <>
          {activeItem && <DropDownSpace activeItem={activeItem} isFadingOut={isFadingOut} />}
        </>
      )}
      <div className={`overlay ${isOverlayShown ? 'show' : ''}`} onClick={handleOverlayClick}></div>
      {isModalActive && <ModalSpace title="개발중" message="아직 개발중입니다 .." btnCount={1} whatonClick={() => {  } } modalActive={isModalActive} setModalActive={setModalActive} btnMsg={'기다리기'} />}
    </div>
  );
};

export default BigHeader;