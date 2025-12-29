import { useState } from 'react'

export default function InfoTooltip({ term, explanation, simple = false }) {
  const [show, setShow] = useState(false)

  const simpleExplanations = {
    'Distance': 'Bu yıldızın Dünya\'dan ne kadar uzakta olduğu. Işık yılı (ly), ışığın bir yılda kat ettiği mesafedir.',
    'Magnitude': 'Yıldızın gökyüzünde ne kadar parlak göründüğü. Sayı ne kadar küçükse, yıldız o kadar parlaktır.',
    'Velocity': 'Yıldızın Dünya\'dan ne kadar hızlı uzaklaştığı veya yaklaştığı. km/s = saniyede kilometre.',
    'Spectral Type': 'Yıldızın rengi ve sıcaklığını gösterir. O (mavi, çok sıcak) → M (kırmızı, soğuk).',
    'Light Year': 'Işığın bir yılda kat ettiği mesafe. Yaklaşık 9.5 trilyon kilometre!',
    'Parsec': 'Astronomların kullandığı bir mesafe birimi. 3.26 ışık yılına eşittir.',
    'AU': 'Astronomik Birim. Dünya ile Güneş arasındaki mesafe (150 milyon km).',
    'Radial Velocity': 'Yıldızın bizden uzaklaşma veya yaklaşma hızı.',
    'Proper Motion': 'Yıldızın gökyüzünde görünen hareketi. Yıldızlar sabit değildir!'
  }

  const fullExplanations = {
    'Distance': 'Yıldızın Dünya\'dan uzaklığı ışık yılı cinsinden. Işık yılı, ışığın boşlukta bir yılda kat ettiği mesafedir (9.46 trilyon km).',
    'Magnitude': 'Görünür kadir değeri. Yıldızın gökyüzünde ne kadar parlak göründüğünü gösterir. Negatif değerler çok parlak, pozitif değerler soluk yıldızları gösterir.',
    'Velocity': 'Radyal hız - yıldızın bizden uzaklaşma (kırmızıya kayma) veya yaklaşma (maviye kayma) hızı. Pozitif değerler uzaklaşmayı, negatif değerler yaklaşmayı gösterir.',
    'Spectral Type': 'Yıldızın spektral sınıfı, rengini ve yüzey sıcaklığını gösterir. O, B, A, F, G, K, M sırasıyla en sıcaktan en soğuğa gider.',
    'Light Year': 'Işığın bir yılda kat ettiği mesafe (9,460,730,472,580.8 km). Uzaydaki mesafeleri ölçmek için kullanılır.',
    'Parsec': 'Paralaks yay saniyesi. 3.261563777167433 ışık yılına eşittir. Astronomların tercih ettiği mesafe birimi.',
    'AU': 'Astronomik Birim. Dünya\'nın Güneş\'e olan ortalama uzaklığı (149,597,870.7 km).',
    'Radial Velocity': 'Yıldızın gözlemciye (Dünya) doğru veya uzak yöndeki hız bileşeni. Doppler etkisi ile ölçülür.',
    'Proper Motion': 'Yıldızın gökyüzünde yılda mili yay saniyesi (mas) cinsinden görünen hareketi. Gerçek hareketin bir bileşenidir.'
  }

  const displayExplanation = simple 
    ? (simpleExplanations[term] || explanation || 'Bilgi için tıklayın')
    : (fullExplanations[term] || explanation || 'Detaylı bilgi için tıklayın')

  return (
    <div className="inline-block relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 text-xs font-bold ml-1 cursor-help transition-all"
        aria-label={`${term} hakkında bilgi`}
      >
        ?
      </button>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 glass-effect rounded-lg shadow-xl text-sm text-gray-200 border border-purple-500/30">
          <div className="font-semibold text-purple-300 mb-1">{term}</div>
          <div className="text-xs leading-relaxed">{displayExplanation}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-purple-500/30"></div>
          </div>
        </div>
      )}
    </div>
  )
}

