import Turndown from 'turndown'

export const loadProposals = async function ({ commit }, { first, offset }) {
  const query = `
    query proposals($first:int, $offset: int) {
      var(func: uid(${this.$config.dho})) {
        proposals as proposal @cascade {
          content_groups {
            contents  @filter(eq(label,"type") and (eq(value, "assignment") or eq(value, "edit") or eq(value, "suspend"))) {
              label
              value
            }
          }
        }
      }
      proposals(func: uid(proposals), orderdesc:created_date, first: $first, offset: $offset) {
        uid
        hash
        creator
        created_date
        content_groups {
          contents {
            label
            value
            type
          }
        }
        original {
          hash
          creator
          created_date
          content_groups {
            contents {
              label
              value
              type
            }
          }
        }
        suspend {
          hash
          creator
          created_date
          content_groups {
            contents {
              label
              value
              type
            }
          }
        }
        votetally {
          hash
          creator
          created_date
          content_groups {
            contents {
              label
              value
              type
            }
          }
        }
        vote {
          hash
          creator
          created_date
          content_groups {
            contents {
              label
              value
              type
            }
          }
        }
      }
    }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addProposals', result.data.proposals)
  return result.data.proposals.length === 0
}

export const saveAssignmentProposal = async function ({ commit, rootState }, draft) {
  const content = [
    { label: 'content_group_label', value: ['string', 'details'] },
    { label: 'period_count', value: ['int64', draft.periodCount] }
  ]

  if (draft.url) {
    content.push(
      { label: 'url', value: ['string', draft.url] }
    )
  }

  if (!draft.edit) {
    content.push({ label: 'time_share_x100', value: ['int64', Math.round(parseFloat(draft.salaryCommitted))] })
    content.push({ label: 'deferred_perc_x100', value: ['int64', Math.round(parseFloat(draft.salaryDeferred))] })
    content.push({ label: 'role', value: ['checksum256', draft.role.hash] })
    content.push({ label: 'assignee', value: ['name', rootState.accounts.account] })
    content.push({ label: 'start_period', value: ['checksum256', draft.startPeriod.value] })
    content.push({ label: 'title', value: ['string', draft.title] })
    content.push({ label: 'description', value: ['string', new Turndown().turndown(draft.description)] })
  } else {
    content.push({ label: 'original_document', value: ['checksum256', draft.hash] })
    content.push({ label: 'ballot_title', value: ['string', 'Assignment extension'] })
    content.push({ label: 'ballot_description', value: ['string', new Turndown().turndown(draft.description)] })
  }

  const actions = [{
    account: this.$config.contracts.dao,
    name: 'propose',
    data: {
      proposer: rootState.accounts.account,
      proposal_type: draft.edit ? 'edit' : 'assignment',
      content_groups: [content]
    }
  }]
  return this.$api.signTransaction(actions)
}

export const loadAssignments = async function ({ commit }, { first, offset }) {
  // TODO: Get rid of 'has(assignment)' call which returns all roles
  const query = `
  query assignments($first:int, $offset: int) {
    var(func: has(assignment)){
      assignments as assignment @cascade{
      content_groups {
          contents  @filter(eq(value,"assignment") and eq(label, "type")){
            label
            value
          }
        }
      }
    }
    assignments(func: uid(assignments), orderdesc:created_date, first: $first, offset: $offset){
      hash
      creator
      created_date
      content_groups{
        contents {
          label
          value
          type
        }
      }
      lastimeshare {
        content_groups {
          contents {
            label
            type
            value
          }
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset })
  commit('addAssignments', result.data.assignments)
  return result.data.assignments.length === 0
}

export const loadUserAssignments = async function ({ commit }, { first, offset, user }) {
  // TODO: Get rid of 'has(assignment)' call which returns all roles
  const query = `
  query assignments($first:int, $offset: int, $user: string) {
    var(func: has(assignment)){
      assignedto as assignment @cascade{
        created_date
        content_groups {
          contents  @filter(eq(value,$user) and eq(label, "assignee")){
            label
            value
          }
        }
      }
    }
    assignments as var(func: uid(assignedto))@cascade{
      content_groups {
        contents  @filter(eq(value,"assignment") and eq(label, "type")){
          label
          value
        }
      }
    }
    assignments(func: uid(assignments), orderdesc:created_date, first: $first, offset: $offset){
      hash
      claimed{
        content_groups {
          contents {
            label
            type
            value
          }
        }
      }
      content_groups{
        contents {
          label
          type
          value
        }
      }
      lastimeshare {
        content_groups {
          contents {
            label
            type
            value
          }
        }
      }
    }
  }
  `
  const result = await this.$dgraph.newTxn().queryWithVars(query, { $first: '' + first, $offset: '' + offset, $user: user })
  commit('addAssignments', result.data.assignments)
  return result.data.assignments.length === 0
}

export const claimAssignmentPayment = async function (context, docId) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'claimnextper',
    data: {
      assignment_id: docId
    }
  }]
  return this.$api.signTransaction(actions)
}
export const claimAllAssignmentPayment = async function (context, { docId, numPeriods }) {
  const actions = []
  for (let i = 0; i < numPeriods; i++) {
    actions.push({
      account: this.$config.contracts.dao,
      name: 'claimnextper',
      data: {
        assignment_id: docId
      }
    })
  }
  return this.$api.signTransaction(actions)
}

export const adjustCommitment = async function ({ rootState }, { docId, commitment }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'adjustcmtmnt',
    data: {
      issuer: rootState.accounts.account,
      adjust_info: [
        [
          { label: 'assignment', value: ['checksum256', docId] },
          { label: 'new_time_share_x100', value: ['int64', commitment] }
        ]
      ]
    }
  }]

  return this.$api.signTransaction(actions)
}

export const adjustDeferred = async function ({ rootState }, { docId, deferred }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'adjustdeferr',
    data: {
      issuer: rootState.accounts.account,
      assignment_id: docId,
      new_deferred_perc_x100: deferred
    }
  }]

  return this.$api.signTransaction(actions)
}

export const suspendAssignment = async function ({ rootState }, { docId, reason }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'suspend',
    data: {
      reason,
      proposer: rootState.accounts.account,
      document_id: docId
    }
  }]

  return this.$api.signTransaction(actions)
}

export const withdrawFromAssignment = async function ({ rootState }, { docId, notes }) {
  const actions = [{
    account: this.$config.contracts.dao,
    name: 'withdraw',
    data: {
      notes,
      owner: rootState.accounts.account,
      document_id: docId
    }
  }]

  return this.$api.signTransaction(actions)
}
