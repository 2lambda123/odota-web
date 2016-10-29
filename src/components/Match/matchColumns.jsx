/* global API_HOST */
import React from 'react';
import heroes from 'dotaconstants/json/heroes.json';
import runes from 'dotaconstants/json/runes.json';
import items from 'dotaconstants/json/items.json';
import orderTypes from 'dotaconstants/json/order_types.json';
import itemIds from 'dotaconstants/json/item_ids.json';
import abilityIds from 'dotaconstants/json/ability_ids.json';
import abilityKeys from 'dotaconstants/json/ability_keys.json';
import heroNames from 'dotaconstants/json/hero_names.json';
import laneRole from 'dotaconstants/json/lane_role.json';
import strings from 'lang';
import {
  formatSeconds,
  abbreviateNumber,
  transformations,
  percentile,
} from 'utility';
import Heatmap from 'components/Heatmap';
import {
  TableHeroImage,
  inflictorWithValue,
} from 'components/Visualizations';
import ReactTooltip from 'react-tooltip';
import NavigationMoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';
import ActionOpenInNew from 'material-ui/svg-icons/action/open-in-new';
import styles from './Match.css';

export const heroTd = (row, col, field, index, hideName) => (
  <TableHeroImage
    image={heroes[row.hero_id] && API_HOST + heroes[row.hero_id].img}
    title={row.name || row.personaname || strings.general_anonymous}
    registered={row.last_login}
    accountId={row.account_id}
    subtitle={`${row.solo_competitive_rank || strings.general_unknown} ${strings.th_mmr}`}
    playerSlot={row.player_slot}
    hideText={hideName}
    confirmed={row.account_id && row.name}
  />
);

export const heroTdColumn = {
  displayName: 'Player',
  field: 'player_slot',
  displayFn: heroTd,
  sortFn: true,
};

export const overviewColumns = match => [{
  field: '',
  displayFn: (row) => {
    if (match.parties) {
      const i = match.players.findIndex(player => player.player_slot === row.player_slot);
      const partyPrev = match.parties[(match.players[i - 1] || {}).player_slot] === match.parties[match.players[i].player_slot];
      const partyNext = match.parties[(match.players[i + 1] || {}).player_slot] === match.parties[match.players[i].player_slot];
      const parentStyle = {
        position: 'relative',
        width: 0,
        height: '100%',
      };
      const style = {
        position: 'absolute',
        width: 10,
        right: -25,
      };
      const borderStyle = `2px solid ${styles.lightGray}`;
      // `row.isRadiant ? styles.green : styles.red` but it have no sense since tables are separated
      if (!partyPrev && partyNext) {
        return (
          <div style={parentStyle}>
            <div style={{ ...style, borderLeft: borderStyle, height: '55%', top: '50%' }} />
            <div style={{ ...style, borderTop: borderStyle, height: '50%', top: '50%' }} />
          </div>
        );
      }
      if (partyPrev && partyNext) {
        return (
          <div style={parentStyle}>
            <div style={{ ...style, borderLeft: borderStyle, height: '120%', top: '-10%' }} />
            <div style={{ ...style, borderTop: borderStyle, height: 2, top: '50%', marginTop: -1 }} />
          </div>
        );
      }
      if (partyPrev && !partyNext) {
        return (
          <div style={parentStyle}>
            <div style={{ ...style, borderBottom: borderStyle, height: '50%', top: 0 }} />
            <div style={{ ...style, borderLeft: borderStyle, height: '56%', top: -1 }} />
          </div>
        );
      }
    }
    return null;
  },
},
  heroTdColumn, {
    displayName: strings.th_level,
    tooltip: strings.tooltip_level,
    field: 'level',
    sortFn: true,
  }, {
    displayName: strings.th_kills,
    tooltip: strings.tooltip_kills,
    field: 'kills',
    sortFn: true,
    displayFn: transformations.kda,
  }, {
    displayName: strings.th_deaths,
    tooltip: strings.tooltip_deaths,
    field: 'deaths',
    sortFn: true,
  }, {
    displayName: strings.th_assists,
    tooltip: strings.tooltip_assists,
    field: 'assists',
    sortFn: true,
  }, {
    displayName: strings.th_gold_per_min,
    tooltip: strings.tooltip_gold_per_min,
    field: 'gold_per_min',
    sortFn: true,
    color: styles.golden,
  }, {
    displayName: strings.th_xp_per_min,
    tooltip: strings.tooltip_xp_per_min,
    field: 'xp_per_min',
    sortFn: true,
  }, {
    displayName: strings.th_last_hits,
    tooltip: strings.tooltip_last_hits,
    field: 'last_hits',
    sortFn: true,
  }, {
    displayName: strings.th_denies,
    tooltip: strings.tooltip_denies,
    field: 'denies',
    sortFn: true,
  }, {
    displayName: strings.th_hero_damage,
    tooltip: strings.tooltip_hero_damage,
    field: 'hero_damage',
    displayFn: row => abbreviateNumber(row.hero_damage),
    sortFn: true,
  }, {
    displayName: strings.th_hero_healing,
    tooltip: strings.tooltip_hero_healing,
    field: 'hero_healing',
    displayFn: row => abbreviateNumber(row.hero_healing),
    sortFn: true,
  }, {
    displayName: strings.th_tower_damage,
    tooltip: strings.tooltip_tower_damage,
    field: 'tower_damage',
    displayFn: row => abbreviateNumber(row.tower_damage),
    sortFn: true,
  }, {
    displayName: strings.th_gold,
    tooltip: strings.tooltip_gold,
    field: 'gold_per_min',
    displayFn: row => abbreviateNumber((row.gold_per_min * row.duration) / 60),
    sortFn: true,
    color: styles.golden,
  }, {
    displayName: strings.th_items,
    tooltip: strings.tooltip_items,
    field: 'items',
    displayFn: (row) => {
      const itemArray = [];
      for (let i = 0; i < 6; i += 1) {
        const itemKey = itemIds[row[`item_${i}`]];
        const firstPurchase = row.first_purchase_time && row.first_purchase_time[itemKey];

        if (items[itemKey]) {
          itemArray.push(
            inflictorWithValue(itemKey, formatSeconds(firstPurchase))
          );
        }
      }
      return itemArray;
    },
  }, {
    displayName: strings.th_ability_builds,
    tooltip: strings.tooltip_ability_builds,
    displayFn: row => (
      <div data-tip data-for={`au_${row.player_slot}`} className={styles.abilityUpgrades}>
        {row.ability_upgrades_arr ? <NavigationMoreHoriz /> : <NavigationMoreHoriz style={{ opacity: 0.4 }} />}
        <ReactTooltip id={`au_${row.player_slot}`} place="left" effect="solid">
          {row.ability_upgrades_arr ? row.ability_upgrades_arr.map(
            (ab, i) => {
              if (ab && !abilityIds[ab].includes('attribute_bonus')) {
                // Here I hide stat upgrades, if necessary it can be displayed
                return (
                  <div className={styles.ability}>
                    {inflictorWithValue(abilityIds[ab], `${strings.th_level} ${i + 1}`)}
                  </div>
                );
              }
              return null;
            }
          ) : <div style={{ paddingBottom: 5 }}>{strings.tooltip_ability_builds_expired}</div>}
        </ReactTooltip>
      </div>
    ),
  },
];

export const benchmarksColumns = (match) => {
  const cols = [
    heroTdColumn,
  ];
  if (match.players && match.players[0] && match.players[0].benchmarks) {
    Object.keys(match.players[0].benchmarks).forEach((key, i) => {
      cols.push({
        displayName: strings[`th_${key}`],
        tooltip: strings[`tooltip_${key}`],
        field: 'benchmarks',
        index: i,
        displayFn: (row, column, field) => {
          if (field) {
            const bm = field[key];
            const bucket = percentile(bm.pct);
            const percent = Number(bm.pct * 100).toFixed(2);
            const value = Number(bm.raw.toFixed(2));
            return (<div data-tip data-for={`benchmarks_${row.player_slot}_${key}`}>
              <span style={{ color: styles[bucket.color] }}>{`${percent}%`}</span>
              <small style={{ margin: '3px' }}>{value}</small>
              <ReactTooltip id={`benchmarks_${row.player_slot}_${key}`} place="top" effect="solid">
                {`${value} ${strings[`th_${key}`]} ${strings.benchmarks_higher_than} ${percent}% ${strings.benchmarks_recent_performances}`}
              </ReactTooltip>
            </div>);
          }
          return null;
        },
      });
    });
  }
  return cols;
};

export const purchaseTimesColumns = (match) => {
  const cols = [heroTdColumn];
  const bucket = 300;
  for (let i = 0; i < match.duration + bucket; i += bucket) {
    const curTime = i;
    cols.push({
      displayName: `${curTime / 60}'`,
      field: 'purchase_log',
      displayFn: (row, column, field) => (<div>
        {field ? field
        .filter(purchase => (purchase.time >= curTime - bucket && purchase.time < curTime))
        .map((purchase) => {
          if (items[purchase.key]) {
            return inflictorWithValue(purchase.key, formatSeconds(purchase.time));
          }
          return <span />;
        }) : ''}
      </div>),
    });
  }
  return cols;
};

export const lastHitsTimesColumns = (match) => {
  const cols = [heroTdColumn];
  const bucket = 300;
  for (let i = 0; i <= match.duration; i += bucket) {
    const curTime = i;
    cols.push({
      displayName: `${curTime / 60}'`,
      field: i,
      sortFn: row => (row.lh_t ? row.lh_t[curTime / 60] : 0),
      displayFn: row => (<div>
        {row.lh_t ? row.lh_t[curTime / 60] : ''}
      </div>),
    });
  }
  return cols;
};

export const performanceColumns = [
  heroTdColumn, {
    displayName: strings.th_lane,
    tooltip: strings.tooltip_lane,
    field: 'lane_role',
    sortFn: true,
    displayFn: (row, col, field) => laneRole[field],
  }, {
    displayName: strings.th_map,
    tooltip: strings.tooltip_map,
    field: 'posData',
    displayFn: (row, col, field) => (field ?
      <Heatmap width={80} points={field.lane_pos} /> :
        <div />),
  }, {
    displayName: strings.th_lane_efficiency,
    tooltip: strings.tooltip_lane_efficiency,
    field: 'lane_efficiency',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field.toFixed(2) : '-'),
  }, {
    displayName: strings.th_lhten,
    tooltip: strings.tooltip_lhten,
    field: 'lh_t',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field[10] : '-'),
  }, {
    displayName: strings.th_dnten,
    tooltip: strings.tooltip_dnten,
    field: 'dn_t',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field[10] : '-'),
  }, {
    displayName: strings.th_multikill,
    tooltip: strings.tooltip_multikill,
    field: 'multi_kills_max',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_killstreak,
    tooltip: strings.tooltip_killstreak,
    field: 'kill_streaks_max',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_stuns,
    tooltip: strings.tooltip_stuns,
    field: 'stuns',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field.toFixed(2) : '-'),
  }, {
    displayName: strings.th_dead,
    tooltip: strings.tooltip_dead,
    field: 'life_state_dead',
    sortFn: true,
    displayFn: (row, col, field) => formatSeconds(field) || '-',
  }, {
    displayName: strings.th_pings,
    tooltip: strings.tooltip_pings,
    field: 'pings',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_biggest_hit,
    tooltip: strings.tooltip_biggest_hit,
    field: 'max_hero_hit',
    sortFn: true,
    displayFn: (row, column, field) => {
      if (field) {
        const hero = heroNames[field.key] || {};
        return (<div>
          {inflictorWithValue(field.inflictor, abbreviateNumber(field.value))}
          <img src={`${API_HOST}${hero.img}`} className={styles.imgSmall} role="presentation" />
        </div>);
      }
      return <div />;
    },
  },
];

export const supportColumns = [
  heroTdColumn, {
    displayName: strings.th_stacked,
    tooltip: strings.tooltip_camps_stacked,
    field: 'camps_stacked',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_tpscroll,
    tooltip: strings.tooltip_purchase_tpscroll,
    field: 'purchase_tpscroll',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_ward_observer,
    tooltip: strings.tooltip_purchase_ward_observer,
    field: 'purchase_ward_observer',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_ward_sentry,
    tooltip: strings.tooltip_purchase_ward_sentry,
    field: 'purchase_ward_sentry',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_smoke_of_deceit,
    tooltip: strings.tooltip_purchase_smoke_of_deceit,
    field: 'purchase_smoke_of_deceit',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_dust,
    tooltip: strings.tooltip_purchase_dust,
    field: 'purchase_dust',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_gem,
    tooltip: strings.tooltip_purchase_gem,
    field: 'purchase_gem',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  },
];

export const chatColumns = [
  heroTdColumn, {
    displayName: strings.th_time,
    field: 'time',
    displayFn: (row, col, field) => formatSeconds(field),
  }, {
    displayName: strings.th_message,
    field: 'key',
  },
];

export const unitKillsColumns = [
  heroTdColumn, {
    displayName: strings.th_heroes,
    tooltip: strings.farm_heroes,
    field: 'hero_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_creeps,
    tooltip: strings.farm_creeps,
    field: 'lane_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_neutrals,
    tooltip: strings.farm_neutrals,
    field: 'neutral_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_ancients,
    tooltip: strings.farm_ancients,
    field: 'ancient_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_towers,
    tooltip: strings.farm_towers,
    field: 'tower_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_couriers,
    tooltip: strings.farm_couriers,
    field: 'courier_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_roshan,
    tooltip: strings.farm_roshan,
    field: 'roshan_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_necronomicon,
    tooltip: strings.farm_necronomicon,
    field: 'necronomicon_kills',
    sortFn: true,
    displayFn: (row, col, field) => field || '-',
  }, {
    displayName: strings.th_other,
    field: 'specific',
    // TODO make this work for non-english (current names are hardcoded in dotaconstants)
    displayFn: (row, col, field) => (<div>
      {Object.keys(field).map(unit => (<div>{`${field[unit]} ${unit}`}</div>))}
    </div>),
  },
];

export const actionsColumns = [heroTdColumn, {
  displayName: strings.th_actions_per_min,
  tooltip: strings.tooltip_actions_per_min,
  field: 'actions_per_min',
  sortFn: true,
}]
  .concat(Object.keys(orderTypes).filter(orderType => `th_${orderTypes[orderType]}` in strings).map(orderType => ({
    displayName: strings[`th_${orderTypes[orderType]}`],
    tooltip: strings[`tooltip_${orderTypes[orderType]}`],
    field: orderType,
    sortFn: row => (row.actions ? row.actions[orderType] : 0),
    displayFn: row => (row.actions ? (row.actions[orderType] || '-') : '-'),
  })));

export const runesColumns = [heroTdColumn]
  .concat(Object.keys(runes).map(runeType => ({
    displayName: strings[`rune_${runeType}`],
    field: 'runes',
    displayFn: (row, col, field) => (field ? (field[runeType] || '-') : '-'),
  })));


const cosmeticsRarity = {
  common: '#B0C3D9',
  uncommon: '#5E98D9',
  rare: '#4B69FF',
  mythical: '#8847FF',
  legendary: '#D32CE6',
  immortal: '#E4AE33',
  arcana: '#ADE55C',
  ancient: '#EB4B4B',
};
export const cosmeticsColumns = [heroTdColumn, {
  displayName: strings.th_cosmetics,
  field: 'cosmetics',
  displayFn: (row, col, field) => field.map((cosmetic, i) => (
    <div
      key={i}
      className={styles.cosmetics}
      data-tip
      data-for={`cosmetic_${cosmetic.item_id}`}
    >
      <a
        href={`https://www.lootmarket.com/dota-2/item/${cosmetic.name}?partner=1101&utm_source=misc&utm_medium=misc&utm_campaign=opendota`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={`http://cdn.dota2.com/apps/570/${cosmetic.image_path}`} role="presentation"
          style={{
            borderBottom: `2px solid ${cosmetic.item_rarity ? cosmeticsRarity[cosmetic.item_rarity] : styles.gray}`,
          }}
        />
        <ActionOpenInNew />
      </a>
      <ReactTooltip id={`cosmetic_${cosmetic.item_id}`} effect="solid">
        <span style={{ color: cosmetic.item_rarity && cosmeticsRarity[cosmetic.item_rarity] }}>
          {cosmetic.name}
          <span>
            {cosmetic.item_rarity}
          </span>
        </span>
      </ReactTooltip>
    </div>
  )),
}];

export const goldReasonsColumns = [heroTdColumn]
  .concat(Object.keys(strings)
    .filter(str => str.indexOf('gold_reasons_') === 0)
    .map(gr => ({
      displayName: strings[gr],
      field: gr,
      sortFn: row => (row.gold_reasons ? row.gold_reasons[gr.substring('gold_reasons_'.length)] : 0),
      displayFn: row => (row.gold_reasons ? (row.gold_reasons[gr.substring('gold_reasons_'.length)] || '-') : '-'),
    })));

export const xpReasonsColumns = [heroTdColumn]
  .concat(Object.keys(strings)
    .filter(str => str.indexOf('xp_reasons_') === 0)
    .map(xpr => ({
      displayName: strings[xpr],
      field: xpr,
      sortFn: row => (row.xp_reasons ? row.xp_reasons[xpr.substring('xp_reasons_'.length)] : 0),
      displayFn: row => (row.xp_reasons ? (row.xp_reasons[xpr.substring('xp_reasons_'.length)] || '-') : '-'),
    })));

export const objectiveDamageColumns = [heroTdColumn]
  .concat(Object.keys(strings).filter(str => str.indexOf('objective_') === 0)
    .map(obj => ({
      displayName: strings[obj],
      field: 'objective_damage',
      displayFn: (row, col, field) => (field ? (field[obj.substring('objective_'.length)] || '-') : '-'),
    })));


export const inflictorsColumns = [{
  displayName: strings.th_damage_received,
  field: 'damage_inflictor_received',
  displayFn: (row, col, field) => (field ? Object.keys(field)
      .sort((a, b) => field[b] - field[a])
      .map(inflictor => inflictorWithValue(inflictor, abbreviateNumber(field[inflictor]))) : ''),
}, {
  displayFn: () => '→',
},
  heroTdColumn, {
    displayFn: () => '→',
  }, {
    displayName: strings.th_damage_dealt,
    field: 'damage_inflictor',
    displayFn: (row, col, field) => (field ? Object.keys(field)
      .sort((a, b) => field[b] - field[a])
      .map(inflictor => inflictorWithValue(inflictor, abbreviateNumber(field[inflictor]))) : ''),
  },
];

export const analysisColumns = [heroTdColumn, {
  displayName: strings.th_analysis,
  field: 'analysis',
  displayFn: (row, col, field) => (
    Object.keys(field).map((key) => {
      const val = field[key];
      val.display = `${val.name}: ${Number(val.value ? val.value.toFixed(2) : '')} / ${Number(val.top.toFixed(2))}`;
      val.pct = val.score(val.value) / val.score(val.top);
      if (val.valid) {
        const percent = field[key].pct;
        const bucket = percentile(percent);
        return (<div>
          <span style={{ color: styles[bucket.color], margin: '10px', fontSize: '18px' }}>{bucket.grade}</span>
          <span>{field[key].display}</span>
          <div className={styles.unusedItem}>{ key === 'unused_item' && field[key].metadata.map(item => inflictorWithValue(item)) }</div>
        </div>);
      }
      return null;
    })
  ),
}];

export const teamfightColumns = [
  heroTdColumn, {
    displayName: strings.th_death,
    field: 'deaths',
  }, {
    displayName: strings.th_damage,
    field: 'damage',
  }, {
    displayName: strings.th_healing,
    field: 'healing',
  }, {
    displayName: strings.th_gold,
    field: 'gold_delta',
  }, {
    displayName: strings.th_xp,
    field: 'xp_delta',
  }, {
    displayName: strings.th_abilities,
    field: 'ability_uses',
    displayFn: (row, col, field) => (field ? Object.keys(field).map((inflictor) => {
      if (abilityKeys[inflictor]) {
        return inflictorWithValue(inflictor, field[inflictor]);
      }
      return <div />;
    }) : ''),
  }, {
    displayName: strings.th_items,
    field: 'item_uses',
    displayFn: (row, col, field) => (field ? Object.keys(field).map((inflictor) => {
      if (items[inflictor]) {
        return inflictorWithValue(inflictor, field[inflictor]);
      }
      return <div />;
    }) : ''),
  },
];
