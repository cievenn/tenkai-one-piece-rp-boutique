export default function HistoryDrawer({ isOpen, close }) {
  return (
    <>
      {isOpen && <div className="drawer-overlay active" onClick={close}></div>}
      
      <div className={`drawer ${isOpen ? 'active' : ''}`} id="history-drawer">
        <div className="drawer-header">
          <h2>Historique</h2>
          <button className="close-drawer" onClick={close}>✖</button>
        </div>
        
        <div className="drawer-body">
          <p className="empty-msg">Aucun achat récent.</p>
        </div>
      </div>
    </>
  );
}