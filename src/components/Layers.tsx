"use client";

import { useEffect, useRef } from "react";
import { FREE_DELIVERY, VAT_RATE, type Product } from "@/lib/data";
import { byId, money, vatIncluded } from "@/lib/utils";
import { cartCount, cartSubtotal, useShop, type Modal as ModalState } from "@/store/shop";
import Checkout from "./Checkout";
import QuickView from "./QuickView";
import SmartImage from "./SmartImage";
import { useFocusTrap, useScrollLock } from "./hooks";
import { Close } from "./icons";

/** Overlay, cart drawer, modal (quick view / checkout / video), toast and the mobile cart FAB. */
export default function Layers() {
  const layer = useShop((s) => s.layer);
  const closeAll = useShop((s) => s.closeAll);
  useScrollLock(layer !== null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeAll]);

  return (
    <>
      <div className={`overlay ${layer ? "show" : ""}`} onClick={closeAll} aria-hidden="true" />
      <CartDrawer open={layer === "drawer"} />
      <Modal open={layer === "modal"} />
      <Toast />
      <Fab />
    </>
  );
}

function CartDrawer({ open }: { open: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const cart = useShop((s) => s.cart);
  const { closeAll, changeQty, removeLine, openModal } = useShop.getState();
  useFocusTrap(ref, open);
  const sub = cartSubtotal(cart);
  const left = Math.max(0, FREE_DELIVERY - sub);

  return (
    <aside ref={ref} className={`drawer ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Shopping cart" inert={!open}>
      <div className="drawer-head">
        <h3>Your order</h3>
        <button className="icon-btn" aria-label="Close cart" onClick={closeAll}><Close /></button>
      </div>
      <div className="drawer-body">
        {!cart.length ? (
          <div className="cart-empty">
            <div aria-hidden="true">🧺</div>
            <p>Your basket is empty.<br />Something sweet is calling.</p>
            <a href="#menu" className="btn btn-dark mt-[18px]" onClick={closeAll}>Browse the menu</a>
          </div>
        ) : (
          <>
            <div className="free-ship">
              {left ? <>You&apos;re <b>{money(left)}</b> away from free delivery 🚲</> : <>🎉 You&apos;ve unlocked <b>free delivery!</b></>}
              <div className="progress"><span style={{ width: `${Math.min(100, (sub / FREE_DELIVERY) * 100)}%` }} /></div>
            </div>
            {cart.map((c) => (
              <div className="line" key={c.key}>
                <div className="limg">
                  <SmartImage src={c.img} alt="" fill sizes="70px" emoji={c.emoji} className="object-cover" />
                </div>
                <div>
                  <b>{c.name}</b>
                  {c.opts && <small>{c.opts}</small>}
                  <div className="stepper">
                    <button aria-label={`Remove one ${c.name}`} onClick={() => changeQty(c.key, -1)}>−</button>
                    <span>{c.qty}</span>
                    <button aria-label={`Add one ${c.name}`} onClick={() => changeQty(c.key, 1)}>+</button>
                  </div>
                </div>
                <div>
                  <b>{money(c.price * c.qty)}</b>
                  <button className="rm" onClick={() => removeLine(c.key)}>Remove</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {cart.length > 0 && (
        <div className="drawer-foot">
          <div className="sum"><span>Subtotal</span><span>{money(sub)}</span></div>
          <div className="sum"><span>Includes VAT ({VAT_RATE * 100}%)</span><span>{money(vatIncluded(sub))}</span></div>
          <div className="sum total"><span>Total</span><span>{money(sub)}</span></div>
          <button className="btn btn-primary" onClick={() => openModal({ kind: "checkout" })}>Checkout →</button>
        </div>
      )}
    </aside>
  );
}

function Modal({ open }: { open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const modal = useShop((s) => s.modal);
  const closeAll = useShop((s) => s.closeAll);
  useFocusTrap(ref, open);
  const modalSeq = useShop((s) => s.modalSeq);
  const product = modal?.kind === "quick" ? byId(modal.id) : undefined;

  return (
    <div ref={ref} className={`modal ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" inert={!open}>
      <button className="icon-btn modal-close" aria-label="Close" onClick={closeAll}><Close /></button>
      {/* Keyed per open so each modal starts with fresh local state. */}
      <ModalBody key={modalSeq} modal={modal} product={product} />
    </div>
  );
}

function ModalBody({ modal, product }: { modal: ModalState | null; product?: Product }) {
  if (modal?.kind === "quick" && product) return <QuickView p={product} />;
  if (modal?.kind === "checkout") return <Checkout />;
  if (modal?.kind === "video")
    return (
      <div className="grid aspect-video place-items-center bg-espresso p-[30px] text-center text-cream">
        <div>
          <div className="text-5xl" aria-hidden="true">🎬</div>
          <h3 id="modal-title" className="my-2.5 text-[1.8rem]">Your brand video goes here</h3>
          <p className="opacity-75">Drop in a YouTube/Vimeo embed or an MP4 of your bakers at work.</p>
        </div>
      </div>
    );
  return null;
}

function Toast() {
  const toast = useShop((s) => s.toast);
  const { hideToast, openDrawer } = useShop.getState();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hideToast, 2800);
    return () => clearTimeout(t);
  }, [toast, hideToast]);

  return (
    <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
      <span>{toast?.msg}</span>
      <button onClick={() => { hideToast(); openDrawer(); }} tabIndex={toast ? 0 : -1}>View cart</button>
    </div>
  );
}

function Fab() {
  const cart = useShop((s) => s.cart);
  const openDrawer = useShop((s) => s.openDrawer);
  const n = cartCount(cart);
  return (
    <button className={`btn btn-dark fab ${n ? "has-items" : ""}`} onClick={openDrawer} aria-label={`Open cart, ${money(cartSubtotal(cart))}`}>
      🛒 Cart · <span>{money(cartSubtotal(cart))}</span>
    </button>
  );
}
