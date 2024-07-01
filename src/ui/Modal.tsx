import * as React from "react";
import "../styles/ui/Modal.css"

export interface ModalSpaceProps {
    title: string,
    message: string,
    btnCount: number,
    btnMsg: string,
    whatonClick: () => void,
    modalActive: boolean,
    setModalActive: (active: boolean) => void
}

export const ModalSpace: React.FC<ModalSpaceProps> = ({ title, message, btnCount, whatonClick, modalActive, setModalActive,btnMsg }) => {
    const closeModal = () => {
        setModalActive(false);
    }
    const buttonCount = (): JSX.Element[] => {
        let buttons: JSX.Element[] = [];
        for(let i = 0; i < btnCount; i++) {
            buttons.push(
                <a key={i} className='a-modal' data-p-cancel onClick={() => {closeModal(); whatonClick()}}>{btnMsg}</a>
            );
        }
        return buttons;
    }
    return (
        <div className={`p-modal-background ${modalActive ? ' nowactive ' : ''}`} onClick={closeModal}>
            <div className={`p-modal${modalActive ? ' active home-modaly' : ''}`} id="example-modal" onClick={e => e.stopPropagation()}>
                <br />
                <h1 className='modal-h1'>{title}</h1>
                <p>{message}</p>
                <br />
                <div className="p-modal-button-container">
                    {buttonCount()}
                    <a className='a-modal' data-p-cancel onClick={() => {closeModal();}}>닫기</a>
                </div>
            </div>
        </div>
    )
}