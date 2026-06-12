import { Link } from 'react-router-dom';

export default function UpcomingDeadlinesWidget() {
  const deadlines = [
    {
      id: 1,
      title: 'NASA Space Apps Challenge',
      company: 'NASA',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg',
      date: 'Today',
      daysLeft: 'Today',
      colorClass: 'text-red-500 bg-red-50'
    },
    {
      id: 2,
      title: 'Microsoft Explore Intern',
      company: 'Microsoft',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      date: '10 Jun 2026',
      daysLeft: '4 Days Left',
      colorClass: 'text-orange-500 bg-orange-50'
    },
    {
      id: 3,
      title: 'Amazon SDE Internship',
      company: 'Amazon',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      date: '15 Jun 2026',
      daysLeft: '30 Days Left',
      colorClass: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 4,
      title: 'HackMIT',
      company: 'MIT',
      logo: 'https://upload.wikimedia.org/wikipedia/en/4/44/MIT_Seal.svg',
      date: '15 Sep 2026',
      daysLeft: '101 Days Left',
      colorClass: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: 5,
      title: 'Smart India Hackathon',
      company: 'SIH',
      logo: 'https://upload.wikimedia.org/wikipedia/en/b/b2/Smart_India_Hackathon_logo.png',
      date: '01 Nov 2026',
      daysLeft: '148 Days Left',
      colorClass: 'text-emerald-500 bg-emerald-50'
    }
  ];

  return (
    <div className="card-standard p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-slate-900">Upcoming Deadlines</h3>
        <Link to="/opportunities" className="text-[12px] font-bold text-[#6D5DF6] hover:text-[#5a4add] transition-colors">
          View all
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {deadlines.map((item) => (
          <div key={item.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] border border-slate-100 flex items-center justify-center p-1.5 shrink-0">
                <img src={item.logo} alt={item.company} className="w-full h-fit object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-extrabold text-slate-900 leading-tight group-hover:text-[#6D5DF6] transition-colors truncate max-w-[150px]">
                  {item.title}
                </span>
                {item.date !== 'Today' && (
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">{item.date}</span>
                )}
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${item.colorClass} shrink-0`}>
              {item.daysLeft}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
