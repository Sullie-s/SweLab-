import { useState } from 'react';
import { useApp } from '../context/AppContext';

const HardwareManagement = () => {
  const [hw1Qty, setHw1Qty] = useState(0);
  const [hw2Qty, setHw2Qty] = useState(0);
  const [loading, setLoading] = useState(false);
  const { hardwareState, checkoutHardware, checkinHardware } = useApp();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (hw1Qty > 0) {
        await checkoutHardware('HWSet1', hw1Qty);
      }
      if (hw2Qty > 0) {
        await checkoutHardware('HWSet2', hw2Qty);
      }
      setHw1Qty(0);
      setHw2Qty(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckin = async () => {
    setLoading(true);
    try {
      if (hw1Qty > 0) {
        await checkinHardware('HWSet1', hw1Qty);
      }
      if (hw2Qty > 0) {
        await checkinHardware('HWSet2', hw2Qty);
      }
      setHw1Qty(0);
      setHw2Qty(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Hardware Sets</h2>
      <div className="grid">
        <div>
          <strong>HWSet1</strong>
          <br />
          Capacity: {hardwareState.HWSet1.capacity}
          <br />
          Available: <span id="avail1">{hardwareState.HWSet1.available}</span>
          <br />
          Change:{' '}
          <input
            type="number"
            id="hw1"
            value={hw1Qty}
            onChange={(e) => setHw1Qty(parseInt(e.target.value) || 0)}
            min="0"
            style={{ width: '80px', marginTop: '4px' }}
          />
        </div>
        <div>
          <strong>HWSet2</strong>
          <br />
          Capacity: {hardwareState.HWSet2.capacity}
          <br />
          Available: <span id="avail2">{hardwareState.HWSet2.available}</span>
          <br />
          Change:{' '}
          <input
            type="number"
            id="hw2"
            value={hw2Qty}
            onChange={(e) => setHw2Qty(parseInt(e.target.value) || 0)}
            min="0"
            style={{ width: '80px', marginTop: '4px' }}
          />
        </div>
      </div>
      <br />
      <button className="primary" onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Checkout'}
      </button>
      <button className="secondary" onClick={handleCheckin} disabled={loading}>
        {loading ? 'Processing...' : 'Check-In'}
      </button>
    </div>
  );
};

export default HardwareManagement;

