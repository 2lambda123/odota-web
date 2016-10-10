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
  Link,
} from 'react-router';
import {
  API_HOST,
} from 'config';
import {
  formatSeconds,
  abbreviateNumber,
  inflictorWithValue,
} from 'utility';
import Heatmap from 'components/Heatmap';
// import { AppBadge } from '../Player';
import styles from './Match.css';

// {row.last_login && row.last_login && <span style={{ marginLeft: 3 }}><AppBadge /></span>}
export const heroTd = (row, col, field, hideName) => (
  <div style={{ marginTop: 5 }}>
    <div>
      <div className={row.isRadiant ? styles.radiant : styles.dire} />
      <img
        src={heroes[field] ? `${API_HOST}/apps/dota2/images/heroes/${heroes[field].name.substring('npc_dota_hero_'.length)}_full.png` : ''}
        style={{ height: 24 }}
        role="presentation"
      />
      {!hideName && <div>{row.account_id ? <Link to={`/players/${row.account_id}`}>{row.personaname}</Link> : strings.general_anonymous}</div>}
    </div>
  </div>
);

export const heroTdColumn = {
  displayName: 'Player',
  field: 'hero_id',
  displayFn: heroTd,
  sortFn: row => (row.player_slot),
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
        width: '100%',
        height: '100%',
      };
      const style = {
        position: 'absolute',
        width: '50%',
        left: '50%',
      };
      const borderStyle = '2px solid #999999';
      if (!partyPrev && partyNext) {
        return (<div style={parentStyle}>
          <div style={Object.assign({}, style, { borderLeft: borderStyle, height: '50%', top: '50%' })} />
          <div style={Object.assign({}, style, { borderTop: borderStyle, height: '50%', top: '50%' })} />
        </div>);
      }
      if (partyPrev && partyNext) {
        return (<div style={parentStyle}>
          <div style={Object.assign({}, style, { borderLeft: borderStyle, height: '100%', top: '0%' })} />
        </div>);
      }
      if (partyPrev && !partyNext) {
        return (<div style={parentStyle}>
          <div style={Object.assign({}, style, { borderBottom: borderStyle, height: '50%', top: '0%' })} />
          <div style={Object.assign({}, style, { borderLeft: borderStyle, height: '50%', top: '0%' })} />
        </div>);
      }
    }
    return <div />;
  },
},
  heroTdColumn, {
    displayName: strings.th_mmr,
    tooltip: strings.tooltip_mmr,
    field: 'solo_competitive_rank',
    sortFn: true,
  }, {
    displayName: strings.th_level,
    tooltip: strings.tooltip_level,
    field: 'level',
    sortFn: true,
  }, {
    displayName: strings.th_kills,
    tooltip: strings.tooltip_kills,
    field: 'kills',
    sortFn: true,
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
    displayName: strings.th_gold,
    tooltip: strings.tooltip_gold,
    field: 'gold_per_min',
    displayFn: row => abbreviateNumber((row.gold_per_min * row.duration) / 60),
    sortFn: true,
  }, {
    displayName: strings.th_gold_per_min,
    tooltip: strings.tooltip_gold_per_min,
    field: 'gold_per_min',
    sortFn: true,
  }, {
    displayName: strings.th_xp_per_min,
    tooltip: strings.tooltip_xp_per_min,
    field: 'xp_per_min',
    sortFn: true,
  }, {
    displayName: strings.th_hero_damage,
    tooltip: strings.tooltip_hero_damage,
    field: 'hero_damage',
    displayFn: row => abbreviateNumber(row.hero_damage),
    sortFn: true,
  }, {
    displayName: strings.th_tower_damage,
    tooltip: strings.tooltip_tower_damage,
    field: 'tower_damage',
    displayFn: row => abbreviateNumber(row.tower_damage),
    sortFn: true,
  }, {
    displayName: strings.th_hero_healing,
    tooltip: strings.tooltip_hero_healing,
    field: 'hero_healing',
    displayFn: row => abbreviateNumber(row.hero_healing),
    sortFn: true,
  }, {
    displayName: strings.th_items,
    tooltip: strings.tooltip_items,
    field: '',
    displayFn: (row) => {
      const itemArray = [];
      for (let i = 0; i < 6; i += 1) {
        const itemKey = itemIds[row[`item_${i}`]];
        const item = items[itemKey];
        const firstPurchase = row.first_purchase_time && row.first_purchase_time[itemKey] / 60;
        const overlay = firstPurchase ? `${firstPurchase.toFixed(0)}'` : '';
        if (item) {
          itemArray.push(
            inflictorWithValue({
              inflictor: itemKey,
              overlay,
              key: i,
            })
          );
        }
      }
      return itemArray;
    },
  },
];

export const abilityUpgradeColumns = [
  heroTdColumn,
].concat(Array.from(new Array(25)).map((e, i) => ({
  displayName: i + 1,
  field: 'ability_upgrades_arr',
  index: i,
  displayFn: (row, column, field) => {
    if (field) {
      const abilityId = field[column.index];
      const abilityKey = abilityIds[abilityId];
      let abilityData = null;
      if (abilityKey) {
        abilityData = {
          img: `${API_HOST}/apps/dota2/images/abilities/${abilityKey}_md.png`,
        };
      }
      if (abilityKey === 'attribute_bonus') {
        // TODO figure out where to do this/localize strings
        abilityData = {
          dname: 'Attribute Bonus',
          img: '/assets/images/stats.png',
          attrib: '+2 All Attributes',
        };
      }
      if (abilityData) {
        return (<img
          src={abilityData.img}
          style={{ height: 35, position: 'relative', left: -10 }}
          role="presentation"
        />);
      }
    }
    return <div />;
  },
})));

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
            // TODO style this better
            return (<div>
              <span>{`${Number(bm.pct * 100).toFixed(2)}%`}</span>
              <span>{bm.raw.toFixed(2)}</span>
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
        .filter(p => (p.time >= curTime - bucket && p.time < curTime))
        .map((p, i) => {
          if (items[p.key]) {
            return inflictorWithValue({ inflictor: p.key, value: formatSeconds(p.time), key: i });
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
    field: 'lane_role',
    sortFn: true,
    displayFn: (row, col, field) => laneRole[field],
  }, {
    displayName: strings.th_map,
    field: 'posData',
    displayFn: (row, col, field) => (field ?
      <Heatmap width={80} points={field.lane_pos} /> :
        <div />),
  }, {
    displayName: strings.th_efften,
    field: 'lane_efficiency',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field.toFixed(2) : ''),
  }, {
    displayName: strings.th_lhten,
    field: 'lh_t',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field[10] : ''),
  }, {
    displayName: strings.th_dnten,
    field: 'dn_t',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field[10] : ''),
  }, {
    displayName: strings.th_multikill,
    field: 'multi_kills_max',
    sortFn: true,
  }, {
    displayName: strings.th_killstreak,
    field: 'kill_streaks_max',
    sortFn: true,
  }, {
    displayName: strings.th_stuns,
    field: 'stuns',
    sortFn: true,
    displayFn: (row, col, field) => (field ? field.toFixed(2) : ''),
  }, {
    displayName: strings.th_dead,
    field: 'life_state_dead',
    sortFn: true,
  }, {
    displayName: strings.th_pings,
    tooltip: strings.tooltip_pings,
    field: 'pings',
    sortFn: true,
  }, {
    displayName: strings.th_biggest_hit,
    field: 'max_hero_hit',
    sortFn: true,
    // TODO figure out why default attack isn't showing up here
    displayFn: (row, column, field) => {
      if (field) {
        const hero = heroNames[field.key] || {};
        return (<div>
          {inflictorWithValue({ inflictor: field.inflictor, value: field.value })}
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
    displayFn: (row, col, field) => field || '',
  }, {
    displayName: strings.th_tpscroll,
    tooltip: strings.tooltip_purchase_tpscroll,
    field: 'purchase',
    // sortFn: (row, col, field) => (field && field.tpscroll),
    displayFn: (row, col, field) => (field && field.tpscroll),
  }, {
    displayName: strings.th_ward_observer,
    tooltip: strings.tooltip_purchase_ward_observer,
    field: 'purchase',
    // sortFn: true,
    displayFn: (row, col, field) => (field && field.ward_observer),
  }, {
    displayName: strings.th_ward_sentry,
    tooltip: strings.tooltip_purchase_ward_sentry,
    field: 'purchase',
    // sortFn: true,
    displayFn: (row, col, field) => (field && field.ward_sentry),
  }, {
    displayName: strings.th_purchase,
    tooltip: strings.tooltip_purchase_smoke_of_deceit,
    field: 'purchase',
    // sortFn: true,
    displayFn: (row, col, field) => (field && field.smoke_of_deceit),
  }, {
    displayName: strings.th_dust,
    tooltip: strings.tooltip_purchase_dust,
    field: 'purchase',
    // sortFn: true,
    displayFn: (row, col, field) => (field && field.dust),
  }, {
    displayName: strings.th_gem,
    tooltip: strings.tooltip_purchase_gem,
    field: 'purchase',
    // sortFn: true,
    displayFn: (row, col, field) => (field && field.gem),
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
  }, {
    displayName: strings.th_creeps,
    tooltip: strings.farm_creeps,
    field: 'lane_kills',
    sortFn: true,
  }, {
    displayName: strings.th_neutrals,
    tooltip: strings.farm_neutrals,
    field: 'neutral_kills',
    sortFn: true,
  }, {
    displayName: strings.th_ancients,
    tooltip: strings.farm_ancients,
    field: 'ancient_kills',
    sortFn: true,
  }, {
    displayName: strings.th_towers,
    tooltip: strings.farm_towers,
    field: 'tower_kills',
    sortFn: true,
  }, {
    displayName: strings.th_couriers,
    tooltip: strings.farm_couriers,
    field: 'courier_kills',
    sortFn: true,
  }, {
    displayName: strings.th_roshan,
    tooltip: strings.farm_roshan,
    field: 'roshan_kills',
    sortFn: true,
  }, {
    displayName: strings.th_necronomicon,
    tooltip: strings.farm_necronomicon,
    field: 'necronomicon_kills',
    sortFn: true,
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
    displayFn: row => (row.actions ? row.actions[orderType] : ''),
  })));

export const runesColumns = [heroTdColumn]
  .concat(Object.keys(runes).map(runeType => ({
    displayName: strings[`rune_${runeType}`],
    field: 'runes',
    displayFn: (row, col, field) => (field ? field[runeType] : ''),
  })));

export const cosmeticsColumns = [heroTdColumn, {
  displayName: strings.th_cosmetics,
  field: 'cosmetics',
  displayFn: (row, col, field) => field.map((cosmetic, i) => (
    <a href={`https://www.lootmarket.com/dota-2/item/${cosmetic.name}?partner=1101&utm_source=misc&utm_medium=misc&utm_campaign=opendota`}>
      <div key={i} style={{ float: 'left', marginRight: '20px' }}>
        <img src={`http://cdn.dota2.com/apps/570/${cosmetic.image_path}`} style={{ height: '40px' }} role="presentation" />
        <div>{cosmetic.name}</div>
      </div>
    </a>)),
}];

export const goldReasonsColumns = [heroTdColumn]
  .concat(Object.keys(strings)
    .filter(str => str.indexOf('gold_reasons_') === 0)
    .map(gr => ({
      displayName: strings[gr],
      field: gr,
      sortFn: row => (row.gold_reasons ? row.gold_reasons[gr.substring('gold_reasons_'.length)] : 0),
      displayFn: row => (row.gold_reasons ? row.gold_reasons[gr.substring('gold_reasons_'.length)] : ''),
    })));

export const xpReasonsColumns = [heroTdColumn]
  .concat(Object.keys(strings)
    .filter(str => str.indexOf('xp_reasons_') === 0)
    .map(xpr => ({
      displayName: strings[xpr],
      field: xpr,
      sortFn: row => (row.xp_reasons ? row.xp_reasons[xpr.substring('xp_reasons_'.length)] : 0),
      displayFn: row => (row.xp_reasons ? row.xp_reasons[xpr.substring('xp_reasons_'.length)] : ''),
    })));

export const objectiveDamageColumns = [heroTdColumn]
  .concat(Object.keys(strings).filter(str => str.indexOf('objective_') === 0)
    .map(obj => ({
      displayName: strings[obj],
      field: 'objective_damage',
      displayFn: (row, col, field) => (field ? field[obj.substring('objective_'.length)] : '-'),
    })));


export const inflictorsColumns = [{
  displayName: strings.th_damage_received,
  field: 'damage_inflictor_received',
  displayFn: (row, col, field) => (field ? Object.keys(field)
      .sort((a, b) => field[b] - field[a])
      .map((k, i) => inflictorWithValue({
        inflictor: k,
        value: abbreviateNumber(field[k]),
        key: i,
      })) : ''),
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
      .map((k, i) => inflictorWithValue({
        inflictor: k,
        value: abbreviateNumber(field[k]),
        key: i,
      })) : ''),
  },
];

export const analysisColumns = [heroTdColumn, {
  displayName: strings.th_analysis,
  field: 'analysis',
  displayFn: (row, col, field) => (
    Object.keys(field).map(f => (
      <div>
        <span>{field[f].pct}</span>
        <span>{field[f].display}</span>
      </div>
    ))
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
    displayFn: (row, col, field) => (field ? Object.keys(field).map((k, i) => {
      if (abilityKeys[k]) {
        return (inflictorWithValue({
          inflictor: k,
          key: i,
        }));
      }
      return <div />;
    }) : ''),
  }, {
    displayName: strings.th_items,
    field: 'item_uses',
    displayFn: (row, col, field) => (field ? Object.keys(field).map((k, i) => {
      if (items[k]) {
        return (inflictorWithValue({
          inflictor: k,
          key: i,
        }));
      }
      return <div />;
    }) : ''),
  },
];
