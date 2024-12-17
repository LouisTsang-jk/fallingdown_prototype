interface WinnerDisplayProps {
  winner: number | null;
}

export function WinnerDisplay({ winner }: WinnerDisplayProps) {
  if (!winner) return null;

  return (
    <div className="mt-4 p-4 bg-green-100 rounded-lg">
      <h3 className="text-lg font-bold text-green-800">
        Ball {winner} wins!
      </h3>
    </div>
  );
}