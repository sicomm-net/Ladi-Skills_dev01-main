#!/usr/bin/env python3
"""Fail-closed structural check of already-performed semantic round-trip.
Never calls an AI, verifies source authority or judges semantics.
"""
import argparse, hashlib, json, re, sys
from pathlib import Path

def canonical(meta):
    return json.dumps(meta, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')

def check(bundle, task, rev):
    errors=[]
    def err(s): errors.append(s)
    if not isinstance(bundle,dict): return ['bundle must be an object']
    meta=bundle.get('meta'); review=bundle.get('review'); measure=bundle.get('measurement')
    if not isinstance(meta,dict) or not isinstance(review,dict) or not isinstance(measure,dict): return ['missing meta/review/measurement object']
    proto=meta.get('protocol',{}); handoff=meta.get('handoff',{}); auth=meta.get('human_authority',{})
    version = proto.get('version') if isinstance(proto,dict) else None
    if not isinstance(proto,dict) or proto.get('id')!='AI_META_HANDOFF' or version not in ('0.3','0.4'):err('wrong protocol')
    if not isinstance(handoff,dict) or handoff.get('direction')!='SPEC_TO_EXECUTOR' or not handoff.get('id'):err('invalid handoff')
    if not isinstance(handoff,dict) or handoff.get('task_id')!=task:err('META task ID mismatch')
    if not isinstance(auth,dict) or auth.get('status')!='AUTHORITATIVE' or not auth.get('source_refs') or not auth.get('precedence'):err('missing human authority')
    ms=meta.get('meta_status',{})
    if not isinstance(ms,dict) or ms.get('semantic_match')!='CONFIRMED' or ms.get('unresolved')!=[]:err('meta status not CONFIRMED')
    reqs=meta.get('requirements'); ids=[]
    if not isinstance(reqs,list) or not reqs:err('missing requirements');reqs=[]
    for r in reqs:
        if not isinstance(r,dict) or not isinstance(r.get('id'),str) or not r['id'].strip():err('invalid requirement');continue
        ids.append(r['id'])
        if not r.get('target') or not r.get('acceptance') or not r.get('source_refs'):err('incomplete requirement '+r['id'])
    if len(set(ids))!=len(ids):err('duplicate requirement IDs')
    rt=review.get('round_trip',{})
    if not isinstance(rt,dict):rt={};err('missing round_trip')
    if rt.get('source_revision')!=rev or not isinstance(rev,str) or not rev.strip():err('stale source revision')
    if not isinstance(auth,dict) or rt.get('original_human_ref') not in auth.get('source_refs',[]):err('human ref not authoritative')
    if rt.get('meta_sha256') != hashlib.sha256(canonical(meta)).hexdigest():err('META digest mismatch')
    if rt.get('reconstruction_input')!='META_ONLY' or not isinstance(rt.get('reconstructed_human'),str) or not rt['reconstructed_human'].strip():err('missing META-only reconstruction')
    if not rt.get('reconstruction_worker') or not rt.get('comparison_worker') or not rt.get('reviewer'):err('missing worker provenance')
    if rt.get('reconstruction_worker') == rt.get('comparison_worker'):err('same worker used to reconstruct and compare')
    if rt.get('gate')!='PASS':err('semantic gate not PASS')
    comparisons=rt.get('comparison')
    if not isinstance(comparisons,list):comparisons=[];err('missing comparison')
    cids=[]
    for c in comparisons:
        if not isinstance(c,dict):err('bad comparison');continue
        cids.append(c.get('requirement_id'))
        if c.get('completeness')!='MATCH' or c.get('meaning')!='MATCH' or any(c.get(k) is not True for k in ('constraints_preserved','prohibitions_preserved','acceptance_preserved')) or c.get('unapproved_additions')!=[] or c.get('discrepancies')!=[]:err('comparison mismatch '+str(c.get('requirement_id')))
    if set(cids)!=set(ids) or len(cids)!=len(ids):err('comparison coverage mismatch')
    if measure.get('task_id')!=task or not task or not isinstance(task,str):err('task ID mismatch')
    if measure.get('protocol_version')!=version or measure.get('final_gate')!='PASS':err('measurement protocol/gate mismatch')
    if measure.get('requirement_count')!=len(ids):err('measurement count mismatch')
    if type(measure.get('iteration')) is not int or measure.get('iteration',0)<1:err('invalid iteration')
    if measure.get('study_mode') not in ('OBSERVATIONAL','CONTROLLED'):err('missing study mode')
    if not isinstance(measure.get('discrepancies'),list):err('missing discrepancy log')
    if not isinstance(measure.get('evidence_refs'),list):err('missing evidence refs')
    for key in ('tokens_input','tokens_output','elapsed_seconds','cost_usd','escaped_defects'):
        val=measure.get(key)
        if val!='NOT_AVAILABLE' and (isinstance(val,bool) or not isinstance(val,(float,int)) or val<0):err('invalid or absent metric '+key)
    return errors

def main():
    p=argparse.ArgumentParser();p.add_argument('--bundle',required=True);p.add_argument('--task',required=True);p.add_argument('--source-revision',required=True);a=p.parse_args()
    try: bundle=json.loads(Path(a.bundle).read_text('utf-8'));errors=check(bundle,a.task,a.source_revision)
    except (OSError,ValueError,TypeError) as e:errors=[str(e)]
    if errors:
        print('BLOCKED: '+'; '.join(errors));return 2
    print('STRUCTURAL_PASS (not semantic verification or authenticated approval)');return 0
if __name__=='__main__':sys.exit(main())
