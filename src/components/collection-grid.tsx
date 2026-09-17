"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { rarityOrder, type CardDefinition, type Rarity } from "@/lib/game/types";

export function CollectionGrid({ cards, quantities, locale }: { cards: CardDefinition[]; quantities: Record<string, number>; locale: "fr" | "en" }) {
  const [rarity, setRarity] = useState<"all" | Rarity>("all");
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [sort, setSort] = useState<"rarity" | "name" | "duplicates">("rarity");
  const displayed = useMemo(() => cards.filter((card) => rarity === "all" || card.rarity === rarity).filter((card) => !ownedOnly || quantities[card.id]).sort((a, b) => sort === "name" ? a.name[locale].localeCompare(b.name[locale]) : sort === "duplicates" ? (quantities[b.id] ?? 0) - (quantities[a.id] ?? 0) : rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)), [cards, locale, ownedOnly, quantities, rarity, sort]);
  return <><div className="filters"><select value={rarity} onChange={(event) => setRarity(event.target.value as "all" | Rarity)}><option value="all">{locale === "fr" ? "Toutes raretés" : "All rarities"}</option>{rarityOrder.map((item) => <option key={item}>{item}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="rarity">{locale === "fr" ? "Trier : rareté" : "Sort: rarity"}</option><option value="name">{locale === "fr" ? "Trier : nom" : "Sort: name"}</option><option value="duplicates">{locale === "fr" ? "Trier : doublons" : "Sort: duplicates"}</option></select><button className={`filter-toggle ${ownedOnly ? "active" : ""}`} onClick={() => setOwnedOnly(!ownedOnly)}>{locale === "fr" ? "Possédées seulement" : "Owned only"}</button></div><div className="collection-grid">{displayed.map((card) => { const quantity = quantities[card.id] ?? 0; return <article key={card.id} className={`mini-card rarity-${card.rarity.toLowerCase()} ${card.mutation ? `mutation mutation-${card.mutation.toLowerCase()}` : ""} ${quantity ? "owned" : "missing"}`}><Image src={card.imageUrl} alt="" width={700} height={460} unoptimized /><div><span>{card.mutation ? `${card.mutation} · ${card.rarity}` : card.rarity}</span><h2>{quantity ? card.name[locale] : "?????"}</h2><small>{quantity ? `×${quantity}` : locale === "fr" ? "Non obtenue" : "Not collected"}</small></div></article>; })}</div></>;
}
