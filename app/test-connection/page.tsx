"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";

export default function TestConnectionPage() {
  const [status, setStatus] = useState<string>("Đang kiểm tra...");
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test 1: Kiểm tra kết nối cơ bản
        const { data: sessionData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          setError(`Auth Error: ${authError.message}`);
          setStatus("❌ Lỗi kết nối Auth");
          return;
        }

        // Test 2: Kiểm tra database - lấy danh sách songs
        const { data: songs, error: songsError } = await supabase
          .from('songs')
          .select('*')
          .limit(5);

        if (songsError) {
          setError(`Database Error: ${songsError.message}`);
          setStatus("⚠️ Kết nối Auth OK, nhưng có vấn đề với Database");
          return;
        }

        // Test 3: Kiểm tra các bảng khác
        const tables = ['albums', 'artists', 'playlists', 'liked_songs'];
        const tableStatus: string[] = [];

        for (const table of tables) {
          const { error } = await supabase
            .from(table as any)
            .select('id')
            .limit(1);
          
          if (!error) {
            tableStatus.push(`✅ ${table}`);
          } else {
            tableStatus.push(`❌ ${table}: ${error.message}`);
          }
        }

        setDbTables(tableStatus);
        setStatus("✅ Kết nối Supabase thành công!");
        
      } catch (err: any) {
        setError(err.message);
        setStatus("❌ Lỗi không xác định");
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🔌 Kiểm tra kết nối Supabase
        </h1>
        
        <div className="bg-neutral-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Trạng thái:</h2>
          <p className="text-lg font-mono text-green-400">{status}</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Lỗi:</h2>
            <p className="text-red-300 font-mono text-sm">{error}</p>
          </div>
        )}

        {dbTables.length > 0 && (
          <div className="bg-neutral-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Trạng thái các bảng:
            </h2>
            <ul className="space-y-2">
              {dbTables.map((table, idx) => (
                <li key={idx} className="text-white font-mono text-sm">
                  {table}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 bg-blue-900/20 border border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">
            📝 Thông tin kết nối:
          </h3>
          <div className="space-y-1 text-sm text-neutral-300 font-mono">
            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30)}...</p>
          </div>
        </div>

        <div className="mt-6">
          <a 
            href="/"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition"
          >
            ← Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
