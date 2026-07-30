'use client';

import React, { useState } from 'react';

export const WeddingGiftSection: React.FC = () => {
    const [copiedBank, setCopiedBank] = useState<string | null>(null);

    const handleCopy = (accountNumber: string) => {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(accountNumber);
            setCopiedBank(accountNumber);
            setTimeout(() => setCopiedBank(null), 2500);
        }
    };

    return (
        <section className="wedding-gift-wrap">
            <div className="orn-clip-mask">
                <div className="image-wrap">
                    <img src="/assets/v1/ornaments/Orn-clip.png" alt="Ornament" />
                </div>
            </div>

            <div className="wedding-gift-inner">
                <div className="wedding-gift-content-wrapper">
                    <div className="frame-bank">
                        <div className="image-wrap">
                            <img src="/assets/v1/ornaments/frame-bank.png" alt="orn-cover" />
                        </div>

                        <div className="ornaments-wrapper">
                            <div className="orn-bank-1">
                                <div className="orn-bank-1-1">
                                    <div className="orn-bank-1-1-1">
                                        <div className="image-wrap">
                                            <img src="/assets/v1/ornaments/Orn-38.png" alt="" />
                                        </div>
                                    </div>
                                    <div className="image-wrap">
                                        <img src="/assets/v1/ornaments/Orn-14.png" alt="" />
                                    </div>
                                </div>
                                <div className="image-wrap">
                                    <img src="/assets/v1/ornaments/Orn-37.png" alt="" />
                                </div>
                            </div>
                            <div className="orn-bank-3">
                                <div className="image-wrap">
                                    <img src="/assets/v1/ornaments/Orn-12.png" alt="" />
                                </div>
                            </div>
                            <div className="orn-bank-2">
                                <div className="orn-bank-2-1">
                                    <div className="image-wrap">
                                        <img src="/assets/v1/ornaments/Orn-40.png" alt="" />
                                    </div>
                                </div>
                                <div className="image-wrap">
                                    <img src="/assets/v1/ornaments/Orn-39.png" alt="" />
                                </div>
                            </div>
                            <div className="orn-bank-4 right">
                                <div className="image-wrap">
                                    <img src="/assets/v1/ornaments/Orn-30.png" alt="" />
                                </div>
                            </div>
                            <div className="orn-bank-4 left">
                                <div className="image-wrap">
                                    <img src="/assets/v1/ornaments/Orn-30.png" alt="" />
                                </div>
                            </div>

                            <div className="orn-bank-5 burung-1">
                                <div className="image-wrap">
                                    <img src="/assets/v1/ornaments/Orn-burung-1.png" alt="Ornament" />
                                </div>
                            </div>
                            <div className="orn-bank-6 burung-2">
                                <div className="image-wrap">
                                    <img src="/assets/v1/ornaments/Orn-burung-2.png" alt="Ornament" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="wedding-gift-content">
                        <div className="wedding-gift-head">
                            <h1 className="wedding-gift-title">Wedding Gift</h1>
                            <p className="wedding-gift-description">
                                Your prayers and presence are the best gift. However, if you want to give a gift we provide a digital envelope to make it easier for you. Thank You
                            </p>
                        </div>

                        <div className="gift-frame no-scrollbar">
                            <div className="wedding-gift-body">
                                <div className="wedding-gift-bank-wrap flex flex-col gap-6">
                                    {/* Seabank Account */}
                                    <div className="bank-item p-4 rounded-xl" id="savingBookSeabank">
                                        <div className="bank-detail flex flex-col gap-1">
                                            <p className="bank-account-name font-semibold text-amber-950">Bank: Seabank</p>
                                            <p className="bank-account-name text-sm text-amber-900">Acc. name: Effri Dwiyana Saputri</p>
                                            <div className="bank-account-number-wrap flex items-center justify-between mt-2 pt-2">
                                                <p className="bank-account-number font-mono font-bold text-amber-950 text-base">
                                                    901127794450
                                                </p>
                                                <button
                                                    type="button"
                                                    className=" flex items-center gap-1.5 px-3 py-1.5  text-black rounded-lg text-xs  transition-all active:scale-95"
                                                    onClick={() => handleCopy('901127794450')}
                                                    title="Copy Account Number"
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                                                    </svg>
                                                    <span>{copiedBank === '901127794450' ? 'Copied!' : 'Copy'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BCA Account */}
                                    <div className="bank-item p-4 rounded-xl" id="savingBookBca">
                                        <div className="bank-detail flex flex-col gap-1">
                                            <p className="bank-account-name font-semibold text-amber-950">Bank: BCA</p>
                                            <p className="bank-account-name text-sm text-amber-900">Acc. name: Alzah Fariski</p>
                                            <div className="bank-account-number-wrap flex items-center justify-between mt-2 pt-2">
                                                <p className="bank-account-number font-mono font-bold text-amber-950 text-base">
                                                    6555500134
                                                </p>
                                                <button
                                                    type="button"
                                                    className=" flex items-center gap-1.5 px-3 py-1.5  text-black rounded-lg text-xs hover:bg-amber-950 transition-all active:scale-95"
                                                    onClick={() => handleCopy('6555500134')}
                                                    title="Copy Account Number"
                                                >
                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                                                    </svg>
                                                    <span>{copiedBank === '6555500134' ? 'Copied!' : 'Copy'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
