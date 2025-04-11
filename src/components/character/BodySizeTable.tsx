'use client';

import React from 'react';
import { Character } from '@/types/gameData';

interface BodySizeTableProps {
  characteristics: Character['characteristics'];
}

type SizeEntry = {
  tag: number;
  height: string;
  slender: string;
  normal: string;
  robust: string;
};

const SIZE_TABLE: SizeEntry[] = [
  { tag: 1, height: '0-30', slender: '0-5', normal: '0-7', robust: '0-15' },
  { tag: 2, height: '31-60', slender: '6-10', normal: '8-15', robust: '11-20' },
  { tag: 3, height: '61-90', slender: '11-15', normal: '15-22', robust: '21-30' },
  { tag: 4, height: '91-105', slender: '16-20', normal: '23-30', robust: '31-40' },
  { tag: 5, height: '106-120', slender: '21-25', normal: '31-37', robust: '41-50' },
  { tag: 6, height: '121-135', slender: '26-30', normal: '38-45', robust: '51-60' },
  { tag: 7, height: '136-150', slender: '31-35', normal: '46-52', robust: '61-70' },
  { tag: 8, height: '151-155', slender: '36-40', normal: '53-60', robust: '71-80' },
  { tag: 9, height: '156-160', slender: '41-45', normal: '61-67', robust: '81-90' },
  { tag: 10, height: '161-165', slender: '46-50', normal: '68-75', robust: '91-100' },
  { tag: 11, height: '166-170', slender: '51-55', normal: '76-82', robust: '101-110' },
  { tag: 12, height: '171-175', slender: '56-60', normal: '83-90', robust: '111-120' },
  { tag: 13, height: '176-180', slender: '61-65', normal: '91-97', robust: '121-130' },
  { tag: 14, height: '181-185', slender: '66-70', normal: '98-105', robust: '131-140' },
  { tag: 15, height: '186-190', slender: '71-75', normal: '106-112', robust: '141-150' },
  { tag: 16, height: '191-195', slender: '76-80', normal: '113-120', robust: '151-160' },
  { tag: 17, height: '196-200', slender: '81-85', normal: '121-127', robust: '161-170' },
  { tag: 18, height: '201-205', slender: '86-90', normal: '128-135', robust: '171-180' },
  { tag: 19, height: '206-210', slender: '91-95', normal: '136-142', robust: '181-190' },
  { tag: 20, height: '211-215', slender: '96-100', normal: '143-150', robust: '191-200' },
  { tag: 21, height: '216-220', slender: '101-105', normal: '151-157', robust: '201-210' },
  { tag: 22, height: '221-225', slender: '106-110', normal: '158-165', robust: '211-220' },
  { tag: 23, height: '226-230', slender: '111-115', normal: '166-172', robust: '221-230' },
  { tag: 24, height: '231-235', slender: '116-120', normal: '173-180', robust: '231-240' },
  { tag: 25, height: '236-240', slender: '121-125', normal: '181-187', robust: '241-250' },
];

export default function BodySizeTable({ characteristics }: BodySizeTableProps) {
  const tagValue = Number(characteristics?.tag?.baseValue || 0);
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">Tabella delle Corporature</h3>
      
      <div className="bg-gray-700 rounded-lg p-3 mb-4 text-sm">
        <p>In Stormbringer la corporatura (longilinea, normale, robusta) del personaggio è determinata generalmente dalla nazionalità. I pesi e le altezze indicati nella Tabella delle taglie indicano i pesi minimi e massimi consentiti per una determinata altezza. Se siete soddisfatti di un peso che rientra fra questi valori, registratelo direttamente all'interno della classe pertinente. È trascurabile sulla scheda del PG. Per gli esseri umani è possibile avere un peso intermedio tra una classe di corporatura determinata e quella successiva (ad es. longilinea-media o media-robusta), ma questa possibilità presenta sia vantaggi che svantaggi. Al personaggio con TAG minore o uguale a 3 non è concessa la modifica del peso.</p>
        
        <p className="mt-2 font-semibold">LONGILINEA</p>
        <p>I PG con corporatura longilinea non possono mai pesare meno del minimo consentito. Se desiderate che il vostro PG abbia un peso maggiore lanciate 1D6:</p>
        <ul className="list-disc list-inside ml-2">
          <li>1-3: il PG è obbligato ad avere il valore di peso massimo consentito per la sua corporatura. Non vi sono né vantaggi né svantaggi particolari</li>
          <li>4-5: il PG ha un peso lievemente maggiore a quello consentito; lanciate 1D6 per sapere di quanti KG aumentare. Aggiungete +1 alla COS e -1 alla DES</li>
          <li>6-9: il PG può pesare a più tanto; lanciate 1D10 per determinare di quanti kg aumenterà il suo peso. Aggiungete +2 alla sua COS e sottraete -1 alla sua DES</li>
        </ul>
        
        <p className="mt-2 font-semibold">NORMALE</p>
        <p>I PG con corporatura normale possono avere un peso superiore o inferiore ai valori limite riportati nella tabella delle taglie. Lanciate 1D10:</p>
        <ul className="list-disc list-inside ml-2">
          <li>1-4: il PG rientra nella media; non vi sono variazioni alle sue Caratteristiche</li>
          <li>5-7: il PG è sottopeso di 1D10 kg rispetto al valore minimo consentito; sottraete quindi -1 alla COS ed aggiungete +1 alla DES</li>
          <li>8-10: il PG è sovrappeso di 1D10 kg rispetto al massimo consentito; aggiungete +1 alla sua COS e sottraete -1 alla DES</li>
        </ul>
        
        <p className="mt-2 font-semibold">ROBUSTA</p>
        <p>I PG con corporatura robusta possono avere un peso superiore o inferiore ai valori limite riportati nella tabella delle taglie. Lanciate 1D10:</p>
        <ul className="list-disc list-inside ml-2">
          <li>1-5: il PG rientra nella media; non vi sono variazioni alle sue Caratteristiche</li>
          <li>6-8: il PG è sottopeso di 1D10 kg rispetto al valore minimo consentito; +1 alla DES</li>
          <li>9-0: il PG è sovrappeso di 2D10 kg rispetto al massimo consentito; +1 alla sua COS e -2 alla DES</li>
        </ul>
      </div>
      
      <div className="overflow-x-auto">
        <div className="overflow-hidden rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  TAG
                </th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Altezza (cm)
                </th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Corporatura<br/>longilinea (kg)
                </th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Corporatura<br/>normale (kg)
                </th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Corporatura<br/>robusta (kg)
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {SIZE_TABLE.map((entry) => (
                <tr 
                  key={entry.tag} 
                  className={tagValue === entry.tag ? 'bg-gray-700' : ''}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <div className={`text-sm font-medium ${tagValue === entry.tag ? 'text-yellow-400' : 'text-white'}`}>
                      {entry.tag}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      {entry.height}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      {entry.slender}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      {entry.normal}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <div className="text-sm text-white">
                      {entry.robust}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 