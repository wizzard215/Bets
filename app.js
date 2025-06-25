// MLB Betting Picks Application
document.addEventListener('DOMContentLoaded', function() {
    // Sample data - this would typically come from an API
    const picksData = [
        {
            "matchup": "New York Yankees vs. Cincinnati Reds",
            "time": "7:10 PM ET",
            "betType": "Reds ML",
            "odds": "+176",
            "impProb": "36.2%",
            "modelProb": "41.0%",
            "edge": "4.8%",
            "teamCode": "CIN",
            "rationale": "Yankees struggling on road (1-9 last 10); Reds hot at home with Brady Singer vs Max Fried providing value"
        },
        {
            "matchup": "Boston Red Sox vs. Los Angeles Angels",
            "time": "4:07 PM ET",
            "betType": "Angels ML",
            "odds": "+144",
            "impProb": "41.0%",
            "modelProb": "58.1%",
            "edge": "17.1%",
            "teamCode": "LAA",
            "rationale": "Massive pitching edge with Kikuchi vs Fitts; Red Sox bullpen ranked 28th in ERA"
        },
        {
            "matchup": "Seattle Mariners vs. Minnesota Twins",
            "time": "2:10 PM ET",
            "betType": "Mariners ML",
            "odds": "+110",
            "impProb": "47.6%",
            "modelProb": "52.0%",
            "edge": "4.4%",
            "teamCode": "SEA",
            "rationale": "Mariners 7-3 last 10 games; Twins disastrous 1-9 stretch; Bryan Woo strong recent form"
        },
        {
            "matchup": "Pittsburgh Pirates vs. Milwaukee Brewers",
            "time": "2:10 PM ET",
            "betType": "Pirates +1.5",
            "odds": "-110",
            "impProb": "52.4%",
            "modelProb": "57.8%",
            "edge": "5.4%",
            "teamCode": "PIT",
            "rationale": "Elite pitching duel Skenes vs Misiorowski; run line value in low-scoring game"
        },
        {
            "matchup": "Miami Marlins vs. San Francisco Giants",
            "time": "9:45 PM ET",
            "betType": "Marlins ML",
            "odds": "+185",
            "impProb": "35.1%",
            "modelProb": "42.0%",
            "edge": "6.9%",
            "teamCode": "MIA",
            "rationale": "Marlins improved road form (6-4 last 10); Giants home struggles; Oracle Park favors underdogs"
        },
        {
            "matchup": "St. Louis Cardinals vs. Chicago Cubs",
            "time": "8:15 PM ET",
            "betType": "Cardinals ML",
            "odds": "+114",
            "impProb": "46.7%",
            "modelProb": "51.2%",
            "edge": "4.5%",
            "teamCode": "STL",
            "rationale": "Cardinals exceptional 8-2 record last 10 games; Cubs road struggles continue"
        }
    ];

    // Team logo mapping (fallback system since we can't use react-mlb-logos)
    const teamLogos = {
        'CIN': { name: 'Reds', color: '#C6011F' },
        'LAA': { name: 'Angels', color: '#BA0021' },
        'SEA': { name: 'Mariners', color: '#0C2C56' },
        'PIT': { name: 'Pirates', color: '#FDB827' },
        'MIA': { name: 'Marlins', color: '#00A3E0' },
        'STL': { name: 'Cardinals', color: '#C41E3A' },
        'NYY': { name: 'Yankees', color: '#132448' },
        'BOS': { name: 'Red Sox', color: '#BD3039' },
        'MIN': { name: 'Twins', color: '#002B5C' },
        'MIL': { name: 'Brewers', color: '#FFC52F' },
        'SF': { name: 'Giants', color: '#FD5A1E' },
        'CHC': { name: 'Cubs', color: '#0E3386' }
    };

    // Global variables
    let currentFilter = 'all';
    let currentSort = 'edge';
    let sortedData = [...picksData];

    // Initialize the application
    function init() {
        renderPicksTable();
        updatePerformanceStats();
        updateHighestEdgePlay();
        setupEventListeners();
    }

    // Render the picks table
    function renderPicksTable() {
        const tbody = document.getElementById('picks-tbody');
        tbody.innerHTML = '';

        // Filter data
        let filteredData = filterData(sortedData, currentFilter);
        
        // Sort data
        filteredData = sortData(filteredData, currentSort);

        filteredData.forEach((pick, index) => {
            const row = createPickRow(pick, index);
            tbody.appendChild(row);
        });
    }

    // Create a table row for a pick
    function createPickRow(pick, index) {
        const row = document.createElement('tr');
        row.className = 'pick-row';
        row.dataset.betType = getBetTypeFilter(pick.betType);
        row.dataset.index = index;

        // Create logo cell
        const logoCell = document.createElement('td');
        const logoElement = createTeamLogo(pick.teamCode);
        logoCell.appendChild(logoElement);

        // Create other cells
        const matchupCell = document.createElement('td');
        matchupCell.className = 'matchup-cell';
        matchupCell.textContent = pick.matchup;

        const timeCell = document.createElement('td');
        timeCell.textContent = pick.time;

        const betTypeCell = document.createElement('td');
        betTypeCell.className = 'bet-type';
        betTypeCell.textContent = pick.betType;

        const oddsCell = document.createElement('td');
        oddsCell.className = 'odds';
        oddsCell.textContent = pick.odds;

        const impProbCell = document.createElement('td');
        impProbCell.textContent = pick.impProb;

        const modelProbCell = document.createElement('td');
        modelProbCell.textContent = pick.modelProb;

        const edgeCell = document.createElement('td');
        edgeCell.className = 'edge';
        const edgeValue = parseFloat(pick.edge.replace('%', ''));
        edgeCell.classList.add(edgeValue > 0 ? 'positive' : 'negative');
        edgeCell.textContent = pick.edge;

        const rationaleCell = document.createElement('td');
        rationaleCell.className = 'rationale-cell';
        rationaleCell.textContent = pick.rationale;

        // Append cells to row
        row.appendChild(logoCell);
        row.appendChild(matchupCell);
        row.appendChild(timeCell);
        row.appendChild(betTypeCell);
        row.appendChild(oddsCell);
        row.appendChild(impProbCell);
        row.appendChild(modelProbCell);
        row.appendChild(edgeCell);
        row.appendChild(rationaleCell);

        // Add click event for modal
        row.addEventListener('click', () => openPickModal(pick));

        return row;
    }

    // Create team logo element
    function createTeamLogo(teamCode) {
        const logoContainer = document.createElement('div');
        logoContainer.className = 'logo-fallback';
        
        const teamInfo = teamLogos[teamCode];
        if (teamInfo) {
            logoContainer.style.backgroundColor = teamInfo.color;
            logoContainer.textContent = teamCode;
        } else {
            logoContainer.textContent = teamCode;
        }

        return logoContainer;
    }

    // Filter data based on bet type
    function filterData(data, filter) {
        if (filter === 'all') return data;
        return data.filter(pick => getBetTypeFilter(pick.betType) === filter);
    }

    // Get bet type filter category
    function getBetTypeFilter(betType) {
        if (betType.includes('ML')) return 'ML';
        if (betType.includes('+1.5') || betType.includes('-1.5')) return 'RL';
        if (betType.includes('Over') || betType.includes('Under')) return 'total';
        return 'ML';
    }

    // Sort data
    function sortData(data, sortBy) {
        const sorted = [...data];
        
        switch (sortBy) {
            case 'edge':
                return sorted.sort((a, b) => {
                    const aEdge = parseFloat(a.edge.replace('%', ''));
                    const bEdge = parseFloat(b.edge.replace('%', ''));
                    return bEdge - aEdge;
                });
            case 'odds':
                return sorted.sort((a, b) => {
                    const aOdds = parseInt(a.odds.replace(/[+\-]/, ''));
                    const bOdds = parseInt(b.odds.replace(/[+\-]/, ''));
                    return bOdds - aOdds;
                });
            case 'time':
                return sorted.sort((a, b) => {
                    const aTime = convertTimeToMinutes(a.time);
                    const bTime = convertTimeToMinutes(b.time);
                    return aTime - bTime;
                });
            default:
                return sorted;
        }
    }

    // Convert time string to minutes for sorting
    function convertTimeToMinutes(timeStr) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        
        if (period === 'PM' && hours !== 12) {
            totalMinutes += 12 * 60;
        } else if (period === 'AM' && hours === 12) {
            totalMinutes -= 12 * 60;
        }
        
        return totalMinutes;
    }

    // Update performance statistics
    function updatePerformanceStats() {
        const mlCount = picksData.filter(pick => getBetTypeFilter(pick.betType) === 'ML').length;
        const rlCount = picksData.filter(pick => getBetTypeFilter(pick.betType) === 'RL').length;
        const totalCount = picksData.filter(pick => getBetTypeFilter(pick.betType) === 'total').length;
        
        document.getElementById('ml-count').textContent = mlCount;
        document.getElementById('rl-count').textContent = rlCount;
        document.getElementById('total-count').textContent = totalCount;
        document.getElementById('total-picks').textContent = picksData.length;

        // Calculate average edge
        const totalEdge = picksData.reduce((sum, pick) => {
            return sum + parseFloat(pick.edge.replace('%', ''));
        }, 0);
        const avgEdge = (totalEdge / picksData.length).toFixed(1);
        document.getElementById('avg-edge').textContent = avgEdge + '%';
    }

    // Update highest edge play
    function updateHighestEdgePlay() {
        const highestEdgePick = picksData.reduce((max, pick) => {
            const currentEdge = parseFloat(pick.edge.replace('%', ''));
            const maxEdge = parseFloat(max.edge.replace('%', ''));
            return currentEdge > maxEdge ? pick : max;
        });

        const container = document.getElementById('highest-edge-play');
        container.innerHTML = `
            <div class="highest-edge-summary">
                <h4>${highestEdgePick.matchup}</h4>
                <div class="edge-value">${highestEdgePick.edge} Edge</div>
                <p><strong>${highestEdgePick.betType}</strong> at ${highestEdgePick.odds}</p>
            </div>
            <p>${highestEdgePick.rationale}</p>
        `;
    }

    // Open pick details modal
    function openPickModal(pick) {
        const modal = document.getElementById('details-modal');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <div class="modal-pick-details">
                <h3>${pick.matchup}</h3>
                <div class="pick-summary">
                    <p><strong>Bet:</strong> ${pick.betType} at ${pick.odds}</p>
                    <p><strong>Game Time:</strong> ${pick.time}</p>
                    <p><strong>Edge:</strong> ${pick.edge} (Model: ${pick.modelProb}, Implied: ${pick.impProb})</p>
                </div>
                <div class="rationale-full">
                    <h4>Detailed Analysis:</h4>
                    <p>${pick.rationale}</p>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    }

    // Setup event listeners
    function setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update filter and re-render
                currentFilter = e.target.dataset.filter;
                renderPicksTable();
            });
        });

        // Sort select
        document.getElementById('sort-select').addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderPicksTable();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('details-modal').style.display = 'none';
        });

        // Modal background click
        document.getElementById('details-modal').addEventListener('click', (e) => {
            if (e.target.id === 'details-modal') {
                document.getElementById('details-modal').style.display = 'none';
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('details-modal').style.display = 'none';
            }
        });
    }

    // Initialize the application
    init();
});

// Utility functions
function formatTime(timeString) {
    // Convert time string to a more readable format if needed
    return timeString;
}

function formatOdds(odds) {
    // Format odds with proper + or - signs
    if (odds.charAt(0) !== '+' && odds.charAt(0) !== '-') {
        return '+' + odds;
    }
    return odds;
}

function calculateImpliedProbability(odds) {
    // Calculate implied probability from American odds
    const oddsNum = parseInt(odds.replace(/[+\-]/, ''));
    let impliedProb;
    
    if (odds.charAt(0) === '+') {
        impliedProb = 100 / (oddsNum + 100);
    } else {
        impliedProb = oddsNum / (oddsNum + 100);
    }
    
    return (impliedProb * 100).toFixed(1) + '%';
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        formatOdds,
        calculateImpliedProbability
    };
}