import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const DAYS   = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

const toYMD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function Availability() {
  const navigate  = useNavigate();
  const { addToCart, isInCart } = useCart();
  const today     = new Date();

  const [current,      setCurrent]      = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [bookedDates,  setBookedDates]  = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [mode,         setMode]         = useState(null); // "single" | "multiple"

  // Single mode
  const [showSinglePopup, setShowSinglePopup] = useState(false);
  const [singleService,   setSingleService]   = useState(null);

  // Multiple mode
  const [showPkgModal,  setShowPkgModal]  = useState(false);
  const [pickerService, setPickerService] = useState(null);
  const [selectedPkg,   setSelectedPkg]   = useState(null);
  const [multiQueue,    setMultiQueue]    = useState([]);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/users/availability/booked-dates")
      .then(res => setBookedDates(res.data.bookedDates || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingAvail(true);
    setMode(null);
    setMultiQueue([]);
    api.get(`/users/availability/date?date=${selectedDate}`)
      .then(res => setAvailability(res.data.availability || []))
      .catch(() => {})
      .finally(() => setLoadingAvail(false));
  }, [selectedDate]);

  const year        = current.getFullYear();
  const month       = current.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth   = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth   = () => setCurrent(new Date(year, month + 1, 1));

  const handleDateClick = (day) => {
    const ymd = toYMD(new Date(year, month, day));
    if (ymd < toYMD(today)) return;
    setSelectedDate(ymd);
    setShowSinglePopup(false);
    setShowPkgModal(false);
    setSingleService(null);
    setPickerService(null);
    setMultiQueue([]);
    setMode(null);
  };

  const getDayStatus = (day) => {
    const ymd = toYMD(new Date(year, month, day));
    if (ymd < toYMD(today))        return "past";
    if (bookedDates.includes(ymd)) return "booked";
    return "available";
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Single mode
  const handleSingleServiceClick = (svc) => {
    if (!svc.available) return;
    setSingleService(svc);
    setShowSinglePopup(true);
  };
  const handleSingleBookPackage = () => {
    navigate(`/services/${singleService.numericId}`, { state: { prefillDate: selectedDate } });
    setShowSinglePopup(false);
  };
  const handleSingleCustomRequest = () => {
    navigate("/custom-request", { state: { prefillService: singleService?.title } });
    setShowSinglePopup(false);
  };

  // Multiple mode
  const isQueued = (svcId) => multiQueue.some(q => String(q.svc._id) === String(svcId));

  const handleMultiServiceClick = (svc) => {
    if (!svc.available) return;
    if (isQueued(svc._id)) {
      setMultiQueue(prev => prev.filter(q => String(q.svc._id) !== String(svc._id)));
      return;
    }
    setPickerService(svc);
    setSelectedPkg(null);
    setShowPkgModal(true);
  };

  const handlePkgConfirm = () => {
    if (!selectedPkg) return;
    setMultiQueue(prev => [...prev, { svc: pickerService, style: selectedPkg }]);
    setShowPkgModal(false);
    setPickerService(null);
    setSelectedPkg(null);
  };

  const handleAddAllToCart = async () => {
    if (multiQueue.length === 0) return;
    let added = 0;
    for (const { svc, style } of multiQueue) {
      const alreadyIn = isInCart(svc._id, style._id || style.id);
      if (!alreadyIn) {
        await addToCart({
          serviceId:    svc._id,
          serviceTitle: svc.title,
          styleId:      style._id || style.id,
          styleName:    style.name,
          styleImg:     style.img || "",
          price:        style.price,
          duration:     style.specs?.find(s => s.label === "Duration")?.value || "",
        });
        added++;
      }
    }
    showToast(`${added} service${added !== 1 ? "s" : ""} added to cart! 🎉`);
    setTimeout(() => navigate("/cart-checkout"), 1200);
  };

  const removeFromQueue = (svcId) => {
    setMultiQueue(prev => prev.filter(q => String(q.svc._id) !== String(svcId)));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Check Availability</h1>
          <p className="text-gray-500 mt-1">Select a date to see which services are available</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition text-gray-600 font-bold text-xl">‹</button>
              <h2 className="text-lg font-semibold text-gray-800">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition text-gray-600 font-bold text-xl">›</button>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const status = getDayStatus(day);
                const ymd    = toYMD(new Date(year, month, day));
                const isSel  = selectedDate === ymd;
                let cls = "relative w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition ";
                if (status === "past")        cls += "text-gray-300 cursor-not-allowed";
                else if (isSel)               cls += "bg-purple-600 text-white shadow-md scale-105 cursor-pointer";
                else if (status === "booked") cls += "bg-red-50 text-red-400 cursor-pointer hover:bg-red-100";
                else                          cls += "bg-green-50 text-green-700 cursor-pointer hover:bg-green-100 hover:scale-105";
                return (
                  <button key={day} className={cls} onClick={() => handleDateClick(day)}>
                    {day}
                    {status === "booked" && !isSel && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-5 justify-center text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-200 inline-block" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-200 inline-block" /> Partially Booked</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Selected</span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full lg:w-80 flex flex-col">
            {!selectedDate ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                <span className="text-4xl mb-3">📅</span>
                <p className="text-gray-500 text-sm">Select a date to see service availability</p>
              </div>
            ) : loadingAvail ? (
              <div className="flex items-center justify-center flex-1 py-12">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </h3>

                {/* Mode toggle */}
                {!mode && (
                  <div className="mt-3 mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">How would you like to book?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setMode("single")}
                        className="py-2.5 rounded-xl text-sm font-semibold border-2 border-purple-200 text-purple-700 hover:bg-purple-50 transition">
                        🎯 Single Event
                      </button>
                      <button onClick={() => setMode("multiple")}
                        className="py-2.5 rounded-xl text-sm font-semibold text-white transition hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#c084fc)" }}>
                        🎪 Multiple Events
                      </button>
                    </div>
                  </div>
                )}

                {/* Mode badge + change */}
                {mode && (
                  <div className="flex items-center justify-between mb-3 mt-1">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                      {mode === "single" ? "🎯 Single Event" : "🎪 Multiple Events"}
                    </span>
                    <button onClick={() => { setMode(null); setMultiQueue([]); }}
                      className="text-xs text-gray-400 hover:text-purple-600 transition">
                      Change ↩
                    </button>
                  </div>
                )}

                {/* Services list */}
                {mode && (
                  <div className="flex flex-col gap-2 overflow-y-auto max-h-80">
                    {availability.map((svc) => {
                      const queued = isQueued(svc._id);
                      const queuedStyle = multiQueue.find(q => String(q.svc._id) === String(svc._id))?.style;
                      return (
                        <button
                          key={svc._id || svc.title}
                          onClick={() => mode === "single" ? handleSingleServiceClick(svc) : handleMultiServiceClick(svc)}
                          disabled={!svc.available}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition
                            ${!svc.available
                              ? "border-red-100 bg-red-50 cursor-not-allowed opacity-70"
                              : queued
                                ? "border-purple-400 bg-purple-50 shadow-sm"
                                : "border-green-200 bg-green-50 hover:bg-green-100 hover:scale-[1.02] cursor-pointer"
                            }`}
                        >
                          <span className="text-xl">{svc.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${!svc.available ? "text-red-500" : queued ? "text-purple-800" : "text-green-800"}`}>
                              {svc.title}
                            </p>
                            <p className={`text-xs truncate ${!svc.available ? "text-red-400" : queued ? "text-purple-600" : "text-green-600"}`}>
                              {!svc.available ? "Not Available in this date🔴" : queued ? `✅ ${queuedStyle?.name}` : "Available ✅"}
                            </p>
                          </div>
                          {mode === "multiple" && svc.available && (
                            <span className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition
                              ${queued ? "bg-purple-600 border-purple-600" : "border-gray-300"}`}>
                              {queued && <span className="text-white text-xs font-bold">✓</span>}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Multiple confirm bar */}
                {mode === "multiple" && multiQueue.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 mb-2">{multiQueue.length} service{multiQueue.length > 1 ? "s" : ""} selected</p>
                    <div className="flex flex-col gap-1 mb-3">
                      {multiQueue.map(({ svc, style }) => (
                        <div key={svc._id} className="flex items-center justify-between bg-purple-50 rounded-lg px-3 py-1.5">
                          <span className="text-xs text-purple-800 font-medium truncate">{svc.icon} {svc.title}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-purple-600 font-semibold">₹{style.price?.toLocaleString()}</span>
                            <button onClick={() => removeFromQueue(svc._id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between px-3 py-1">
                        <span className="text-xs font-bold text-gray-700">Total</span>
                        <span className="text-xs font-bold text-purple-600">
                          ₹{multiQueue.reduce((s, q) => s + (q.style.price || 0), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button onClick={handleAddAllToCart}
                      className="w-full py-3 rounded-xl font-bold text-white text-sm transition hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#c084fc)" }}>
                      🛒 Add to Cart & Confirm
                    </button>
                  </div>
                )}

                {mode === "single" && (
                  <p className="text-xs text-gray-400 mt-3">Tap an available service to book</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Single Popup */}
      {showSinglePopup && singleService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => setShowSinglePopup(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
            onClick={e => e.stopPropagation()}>
            <div className="text-center mb-5">
              <span className="text-4xl">{singleService.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 mt-2">{singleService.title}</h3>
              <p className="text-sm text-gray-500 mt-1">How would you like to proceed?</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={handleSingleBookPackage}
                className="w-full py-3 rounded-xl font-semibold text-white transition hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c084fc)" }}>
                📦 Book a Package
              </button>
              <button onClick={handleSingleCustomRequest}
                className="w-full py-3 rounded-xl font-semibold text-white transition hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#f472b6,#fb923c)" }}>
                ✏️ Custom Request
              </button>
              <button onClick={() => setShowSinglePopup(false)}
                className="w-full py-2 rounded-xl text-gray-500 text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Picker Modal */}
      {showPkgModal && pickerService && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={() => { setShowPkgModal(false); setPickerService(null); setSelectedPkg(null); }}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <span className="text-3xl">{pickerService.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 mt-1">{pickerService.title}</h3>
              <p className="text-sm text-gray-500">Choose a package to add to cart</p>
            </div>

            {pickerService.styles && pickerService.styles.length > 0 ? (
              <div className="flex flex-col gap-3">
                {pickerService.styles.map((style) => (
                  <button key={style.id}
                    onClick={() => {
                      // Auto-confirm: select + immediately add to queue + close
                      setMultiQueue(prev => {
                        const filtered = prev.filter(q => String(q.svc._id) !== String(pickerService._id));
                        return [...filtered, { svc: pickerService, style }];
                      });
                      setShowPkgModal(false);
                      setPickerService(null);
                      setSelectedPkg(null);
                    }}
                    className="text-left rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition overflow-hidden">
                    {/* Package image */}
                    {style.img && (
                      <img src={style.img} alt={style.name}
                        className="w-full h-32 object-cover" />
                    )}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-800 text-sm">{style.name}</p>
                        <p className="font-bold text-purple-600 text-sm">₹{style.price?.toLocaleString()}</p>
                      </div>
                      {style.desc && <p className="text-xs text-gray-500 mb-2">{style.desc}</p>}
                      {style.specs && style.specs.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {style.specs.slice(0, 3).map((sp, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {sp.label}: {sp.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-6">No packages found for this service.</p>
            )}

            <button onClick={() => { setShowPkgModal(false); setPickerService(null); setSelectedPkg(null); }}
              className="w-full mt-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-semibold z-50
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}