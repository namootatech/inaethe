import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export function Graph({ data, dataKey, title }) {
    return (<div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-2 text-gray-100">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
          <XAxis dataKey="name" stroke="#9CA3AF"/>
          <YAxis stroke="#9CA3AF"/>
          <Tooltip contentStyle={{ backgroundColor: '#1E3A8A', border: 'none', color: '#fff' }}/>
          <Line type="monotone" dataKey={dataKey} stroke="#D946EF" strokeWidth={2}/>
        </LineChart>
      </ResponsiveContainer>
    </div>);
}
