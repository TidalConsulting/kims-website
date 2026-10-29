"use client";

import { useEffect, useRef } from "react";
import { FREE_DELIVERY, VAT_RATE, type Product } from "@/lib/data";
import { byId, cartTotals, money } from "@/lib/utils";
import { cartCount, useShop, type Modal as ModalState } from "@/store/shop";
import Checkout from "./Checkout";
import QuickView from "./QuickView";
import { isPlate } from "@/lib/photos";
import SmartImage from "./SmartImage";
import { useFocusTrap, useScrollLock } from "./hooks";
import { Check, Close } from "./icons";
import { INFO, type InfoPage } from "@/lib/info";

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
  const t = cartTotals(cart);
  const left = Math.max(0, FREE_DELIVERY - t.afterDiscount);

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
              <div className="progress"><span style={{ width: `${Math.min(100, (t.afterDiscount / FREE_DELIVERY) * 100)}%` }} /></div>
            </div>
            {cart.map((c) => (
              <div className="line" key={c.key}>
                <div className={`limg ${isPlate(byId(c.pid)) ? "slate-bg" : ""}`}>
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
          <div className="sum"><span>Subtotal</span><span>{money(t.sub)}</span></div>
          {t.discount > 0 && (
            <div className="sum text-pink"><span>Drink + pastry pairing ×{t.pairs}</span><span>−{money(t.discount)}</span></div>
          )}
          <div className="sum total"><span>Total</span><span>{money(t.total)}</span></div>
          <div className="sum -mt-2.5 mb-3.5 text-[.78rem]"><span>Includes {VAT_RATE * 100}% VAT</span><span>{money(t.vat)}</span></div>
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
  if (modal?.kind === "info") return <InfoBody page={modal.page} />;
  if (modal?.kind === "paid")
    return (
      <div className="done">
        <div className="check"><Check /></div>
        <h3 id="modal-title">Payment received!</h3>
        <p>Thank you! The kitchen has your order and we&apos;ll text you when it&apos;s ready.</p>
        <div className="order-no">Order #{modal.orderNo}</div>
      </div>
    );
  if (modal?.kind === "video")
    return (
      <div className="flex aspect-video items-center justify-center bg-plum p-[30px] text-center text-cotton">
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
  const total = cartTotals(cart).total;
  return (
    <button className={`btn btn-dark fab ${n ? "has-items" : ""}`} onClick={openDrawer} aria-label={`Open cart, ${money(total)}`}>
      🛒 Cart · <span>{money(total)}</span>
    </button>
  );
}

function InfoBody({ page }: { page: InfoPage }) {
  const info = INFO[page];
  return (
    <div className="checkout max-w-[70ch]">
      <span className="eyebrow">Help</span>
      <h3 id="modal-title">{info.title}</h3>
      <div className="mt-4 flex flex-col gap-4 text-[.95rem]">
        {info.blocks.map((b, i) => (
          <div key={i}>
            {b.h && <h4 className="mb-1 font-display text-lg font-semibold">{b.h}</h4>}
            {b.p && <p className="text-muted">{b.p}</p>}
            {b.list && <ul className="list-disc pl-5 text-muted">{b.list.map((x) => <li key={x}>{x}</li>)}</ul>}
          </div>
        ))}
      </div>
    </div>
  );
}
