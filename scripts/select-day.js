fetch("movies.json")
        .then((res) => res.json())
        .then((movies) => {
          const grid = document.getElementById("dayGrid");

          for (let i = 0; i < movies.length; i++) {
            const status = localStorage.getItem("dayStatus_" + i); 
            let icon = "⬜";
            if (status === "win") icon = "✅";
            else if (status === "lose") icon = "❌";

            const day = document.createElement("div");
            day.className = "day";
            day.innerHTML = `Day ${i + 1}<span class="status">${icon}</span>`;
            day.onclick = () => {
              localStorage.setItem("selectedDay", i);
              window.location.href = "play.html";
            };
            grid.appendChild(day);
          }
        });

      function startCountdown() {
        const el = document.getElementById("countdown");

        function tick() {
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0); 

          const diff = tomorrow - now;

          const h = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, "0");
          const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(
            2,
            "0"
          );
          const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

          el.textContent = `🕒 Next movie in: ${h}h ${m}m ${s}s`;
        }

        tick();
        setInterval(tick, 1000);
      }

      startCountdown();